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
    konfirmasi,
    inputKonfirmasi,
    jeda,
    tampilkanJudul
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

    tampilkanRiwayatTransaksi() {
        this.bersihkanRiwayatTransaksiLama()

        for (const i in this.riwayatTransaksi) {
            this.riwayatTransaksi[i].tampilkanPerbarui(false, false)
            console.log("")
        }

        jeda()
    }

    ubahNama() {
        this.nama = inputKonfirmasi(this.nama, "Nama member")
    }

    ubahNoWA() {
        this.noWA = inputKonfirmasi(this.noWA, "No. WA member")
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
        let notif

        do {
            jadi = false
            notif = null

            if (validasiUlang) {
                this.valid = false
            }

            tampilkanJudul(judul)

            if (!pertanyaan) {
                pertanyaan = "Kode member (besar kecil huruf berpengaruh): "
            }

            if (opsi == "lanjutJikaAda+") {
                console.log("Y. Tambah member")
            }

            console.log("X. Batal")
            tampilkanJudul("-", null, "-", false)
            this.tag = input.question(pertanyaan)

            if (this.tag.toLowerCase() == "x") {
                // biarkan saja
            } else if (this.tag == "0") {
                notif = "Input tidak valid, coba lagi"
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
                    notif = "Input tidak valid, coba lagi"
                }
            } else if (typeof this.daftarMember[this.tag] == "undefined") {
                if (opsi == "lanjutJikaAda" || opsi == "lanjutJikaAda+") {
                    notif = "Kode member tidak ditemukan, coba lagi"
                } else {
                    jadi = true
                }
            } else {
                if (opsi == "lanjutJikaTiada") {
                    notif = "Kode member sudah digunakan, coba lagi"
                } else {
                    jadi = true
                    this.valid = true
                    this.member = this.daftarMember[this.tag]
                }
            }

            if (notif) {
                console.log("\n")
                tampilkanJudul(notif, null, "=")
                console.log("")
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

            tampilkanJudul("Kode member berhasil diubah", null, "=")
            console.log("\n")
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
                    tampilkanJudul("Member berhasil ditambah", null, "=")
                    console.log("\n")
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
            let notif = `Member "${this.member.nama}" (${this.member.kode}) berhasil dihapus`

            delete this.daftarMember[kodeLama]
            this.nonaktifkan()

            clear()
            tampilkanJudul(notif, null, "=")
            console.log("\n")
        } else {
            clear()
        }
    }

    tampilkanDaftarMember() {
        let item

        for (const i in this.daftarMember) {
            item = this.daftarMember[i]
            console.log(`| ${item.kode}  -  ${item.nama}  -  ${item.poin} poin`)
            console.log(`| No. WA: ${item.noWA}\n`)
        }

        jeda()
    }
}