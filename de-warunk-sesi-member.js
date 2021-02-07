/* de-warunk-sesi-member.js
 *
 * Copyright 2021 De Warunk Team <rivanfebrian123@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import input from 'readline-sync'
import clear from 'console-clear'

import {
    konfirmasi
} from './de-warunk-lintas-bidang.js'

export class Member {
    kode
    nama
    noWA
    poin
    riwayatTransaksi = []
    daftarPromoDiklaim = []

    constructor(kode, nama, noWA, poin) {
        this.kode = kode
        this.nama = nama
        this.noWA = noWA
        this.poin = poin
    }

    bersihkanKlaimPromoLama() {
        let waktu = new Date()

        for (const kode in this.daftarPromoDiklaim) {
            if (this.daftarPromoDiklaim[kode].batasAkhir < waktu) {
                delete this.daftarPromoDiklaim[kode]
            }
        }
    }

    bersihkanRiwayatTransaksiLama() {
        let banyak = this.riwayatTransaksi.length
        let sisa

        if (banyak > 25) {
            sisa = banyak - 25

            for (let i = 1; i <= sisa; i++) {
                this.riwayatTransaksi.shift()
            }
        }
    }

    lihatRiwayatTransaksi() {
        this.bersihkanRiwayatTransaksiLama()

        for (const i in this.riwayatTransaksi) {
            this.riwayatTransaksi[i].tampilkanPerbarui(false, false)
            console.log("")
        }

        input.question("Tekan enter untuk lanjutkan...", {
            hideEchoBack: true,
            mask: ""
        })
        clear()
    }

    ubahNama() {
        console.log("===Ubah nama===")
        console.log("X. Batal")
        let nama = input.question("Nama baru: ")
        clear()

        if (nama.toLowerCase() != "x") {
            this.nama = nama
            console.log("===Nama berhasil diubah===\n\n")
        }
    }

    ubahNoWA() {
        console.log("===Ubah no. WA===")
        console.log("X. Batal")
        let noWA = input.question("No. WA baru: ")
        clear()

        if (noWA.toLowerCase() != "x") {
            this.noWA = noWA
            console.log("===No. WA berhasil diubah===\n\n")
        }
    }
}

export class Sesi {
    daftarMember = []
    valid
    member
    tag

    constructor() {
        this.valid = false
        this.tag = ""
    }

    aktifkanCek(opsi = "lanjutJikaAda", judul = null, pertanyaan = null, validasiUlang = false) {
        let jadi

        do {
            jadi = false

            if (validasiUlang) {
                this.valid = false
            }

            if (!pertanyaan) {
                pertanyaan = "Kode member (besar kecil huruf berpengaruh): "
            }

            if (judul) {
                console.log("==========================")
                console.log(judul)
                console.log("==========================")
            }

            if (opsi == "lanjutJikaAda+") {
                console.log("Y. Tambah member")
            }

            console.log("X. Batal")
            console.log("------------------------------")
            this.tag = input.question(pertanyaan)

            if (this.tag == "0") {
                console.log("\n\n==Input tidak valid, silakan coba lagi==\n")
            } else if (this.tag.toLowerCase() == "x") {
                console.log("")
            } else if (this.tag.toLowerCase() == "y") {
                if (opsi == "lanjutJikaAda+") {
                    console.log("\n")

                    if (this.tambahMember(false)) { //mempengaruhi this.tag
                        jadi = true
                        this.valid = true //paksa, karena fungsi itu tidak memvalidasi
                        this.member = this.daftarMember[this.tag]
                    } else {
                        console.log("\n")
                        this.tag = "" //agar perulangan tidak berhenti jika "x"
                    }
                } else {
                    console.log("\n\n==Input tidak valid, silakan coba lagi==\n")
                }
            } else if (typeof this.daftarMember[this.tag] == "undefined") {
                if (opsi == "lanjutJikaAda" || opsi == "lanjutJikaAda+") {
                    console.log("\n\n==Kode member tidak ditemukan, coba lagi==\n")
                } else {
                    jadi = true
                }
            } else {
                if (opsi == "lanjutJikaTiada") {
                    console.log("\n\n==Kode member sudah digunakan, silakan coba lagi==\n")
                } else {
                    jadi = true
                    this.valid = true
                    this.member = this.daftarMember[this.tag]
                }
            }
        } while (!jadi && this.tag.toLowerCase() != "x")

        return jadi
    }

    nonaktifkan(hapusDaftarMember = false) {
        if (hapusDaftarMember) {
            this.daftarMember = false
        }

        this.member = false
        this.tag = ""
        this.valid = false
    }

    ubahKodeMember(kodeLama) {
        //fungsi ini bersifat mengaktifkan sesi tapi tanpa validasi
        if (this.aktifkanCek("lanjutJikaTiada", "Ubah kode member", "Kode member baru (besar kecil huruf berpengaruh): ")) {
            this.daftarMember[this.tag] = this.daftarMember[kodeLama]
            this.member = this.daftarMember[this.tag]
            this.member.kode = this.tag

            delete this.daftarMember[kodeLama]
            clear()

            console.log("===Kode member berhasil diubah===\n\n")
        } else {
            clear()
        }
    }

    tambahMember(bersihkanJikaBatal = true) {
        //fungsi ini bersifat mengaktifkan sesi, mengubah tag, dan juga
        //digunakan di this.aktifkanCek()
        let jadi = false

        if (this.aktifkanCek("lanjutJikaTiada", "Tambah member")) {
            let nama = input.question("Nama: ")

            if (nama.toLowerCase() != "x") {
                let noWA = input.question("No. WA: ")

                if (noWA.toLowerCase() != "x") {
                    this.daftarMember[this.tag] = new Member(this.tag, nama, noWA, 0)
                    jadi = true
                    clear()
                    console.log("====Member berhasil ditambah====\n\n")
                }
            }
        }

        if (!jadi && bersihkanJikaBatal) {
            clear()
        }

        return jadi
    }

    hapusMember(kodeLama) {
        if (konfirmasi("Hapus member")) {
            this.member = this.daftarMember[kodeLama]
            let notif = `===Member "${this.member.nama}" (${this.member.kode}) berhasil dihapus===\n\n`

            delete this.daftarMember[kodeLama]
            this.nonaktifkan()

            clear()
            console.log(notif)
        } else {
            clear()
        }
    }
}
