/* manajemen.js
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
    Sesi
} from './manajemen-sesi.js'

import {
    Member,
    Promo,
    Jualan,
    daftarPertanyaanMember,
    daftarPertanyaanPromo,
    daftarPertanyaanJualan
} from './manajemen-data.js'

import {
    konfirmasi,
    tampilkanJudul,
    namaBulan
} from './utilitas.js'

export class Manajemen {
    sesiMember
    sesiJualan
    sesiPromo

    constructor() {
        this.sesiMember = new Sesi(Member, "Member", daftarPertanyaanMember)
        this.sesiPromo = new Sesi(Promo, "Promo", daftarPertanyaanPromo)
        this.sesiJualan = new Sesi(Jualan, "Jualan", daftarPertanyaanJualan)
    }

    bersihkanPromoLama() {
        let waktu = new Date()

        for (const kode in this.sesiPromo.daftarItem) {
            if (this.sesiPromo.daftarItem[kode].batasAkhir < waktu) {
                delete this.sesiPromo.daftarItem[kode]
            }
        }
    }

    // TODO: aktifkanCek sesi
    klaimPromo() {
        let waktu = new Date()
        let member = this.sesiMember.item
        let daftarPromo = this.sesiPromo.daftarItem
        let i = 1
        let iAsli = [""]

        tampilkanJudul(`Klaim promo ${namaBulan[waktu.getMonth()]} ${waktu.getFullYear()}`)
        console.log(`Hai ${member.nama}, poin kamu adalah ${member.poin}`)
        console.log("Ayo tambah poinmu untuk menangkan:\n")

        this.bersihkanPromoLama()
        member.bersihkanKlaimPromoLama()
        tampilkanJudul("Promo-promo belum diklaim", null, "-")

        for (const kode in daftarPromo) {
            if (typeof member.daftarPromoDiklaim[kode] == "undefined") {
                let item = daftarPromo[kode]

                console.log(`|${i}. ${item.nama}`)
                console.log(`|   Poin diharapkan: ${item.poinDiharapkan}`)

                if (member.poin >= item.poinDiharapkan) {
                    console.log("|   ---POIN TERPENUHI, boleh klaim---")
                }

                console.log(`|   Batas waktu akhir: ${item.batasAkhir.toLocaleString("id-ID")}`)

                if (item.syaratTambahan) {
                    console.log(`|   Syarat tambahan: ${item.syaratTambahan}`)
                }

                console.log("")

                iAsli[i] = kode
                i++
            }
        }

        tampilkanJudul("Promo-promo sudah diklaim", null, "-")
        for (const kode in member.daftarPromoDiklaim) {
            let item = member.daftarPromoDiklaim[kode]

            console.log(`| ${item.nama}`)
            console.log(`| Poin diharapkan: ${item.poinDiharapkan}`)

            if (item.syaratTambahan) {
                console.log(`| Syarat tambahan: ${item.syaratTambahan}`)
            }

            console.log("")
        }

        tampilkanJudul("0. Kembali", "-", null, false)

        let menu = parseInt(input.question("Pilih promo untuk diklaim: "))
        let kodeItem = iAsli[menu]
        let item = daftarPromo[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof item != "undefined") {
            console.log("\n")

            if (member.poin >= item.poinDiharapkan) {
                if (konfirmasi(`Klaim promo ${item.nama} (${item.poinDiharapkan} poin)`)) {
                    member.daftarPromoDiklaim[kodeItem] = item
                    let poinLama = member.poin

                    member.poin -= item.poinDiharapkan

                    clear()
                    tampilkanJudul(`Selamat, ${member.nama}. Kamu berhasil memenangkan ${item.nama}`, null, "=")
                    tampilkanJudul(`Poin kamu sekarang adalah ${member.poin} (${poinLama} - ${item.poinDiharapkan})`, null, "=")
                    console.log("\n")
                } else {
                    clear()
                }
            } else {
                clear()
                tampilkanJudul(`Oops! Poin kamu tidak cukup. Kamu perlu ${item.poinDiharapkan - member.poin} poin lagi untuk memenangkan ${item.nama}`, null, "=")
                console.log("\n")
            }
        } else {
            clear()
        }

        if (menu != 0) {
            this.klaimPromo()
        }
    }

    nonaktifkanSemuaSesi() {
        this.sesiMember.nonaktifkan()
        this.sesiPromo.nonaktifkan()
        this.sesiJualan.nonaktifkan()
    }
}