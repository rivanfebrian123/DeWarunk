/* de-warunk-lintas-bidang.js
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

var namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
    "Agustus", "September", "Oktober", "November", "Desember"
]


export function konfirmasi(judul = "", pertanyaan = "Lanjutkan") {
    let lanjut
    let jawaban = false

    do {
        if (judul != "") {
            console.log("==========================================")
            console.log(judul)
            console.log("==========================================")
        }

        lanjut = input.question(`${pertanyaan} (YA/BATAL): `).toLowerCase()
        console.log("")
    } while (lanjut != "ya" && lanjut != "batal")

    if (lanjut == "ya") {
        jawaban = true
    }

    return jawaban
}


export function klaimPromo(member, jualan) {
    let waktu = new Date()
    let i = 1
    let iAsli = [""]

    console.log("============================================")
    console.log(`Klaim promo ${namaBulan[waktu.getMonth()]} ${waktu.getFullYear()}`)
    console.log("============================================")
    console.log(`Hai ${member.nama}, poin kamu adalah ${member.poin}`)
    console.log("Ayo tambah poinmu untuk menangkan:\n")

    jualan.bersihkanPromoLama()
    member.bersihkanKlaimPromoLama()

    console.log("---------Promo2 belum diklaim-----------")
    for (const kode in jualan.daftarPromo) {
        if (typeof member.daftarPromoDiklaim[kode] == "undefined") {
            let item = jualan.daftarPromo[kode]

            console.log(`|${i}. ${item.hadiah}`)
            console.log(`|   Poin diharapkan: ${item.poinDiharapkan}`)

            if (member.poin >= item.poinDiharapkan) {
                console.log("|   ---POIN TERPENUHI, boleh klaim---")
            }

            console.log(`|   Batas waktu akhir: ${item.batasAkhir.toLocaleString("id-ID")}`)

            if (item.syaratTambahan != "-") {
                console.log(`|   Syarat tambahan: ${item.syaratTambahan}`)
            }

            console.log("")

            iAsli[i] = kode
            i++
        }
    }

    console.log("---------Promo2 sudah diklaim-----------")
    for (const kode in member.daftarPromoDiklaim) {
        let item = member.daftarPromoDiklaim[kode]

        console.log(`| ${item.hadiah}`)
        console.log(`| Poin diharapkan: ${item.poinDiharapkan}`)

        if (item.syaratTambahan != "-") {
            console.log(`| Syarat tambahan: ${item.syaratTambahan}`)
        }

        console.log("")
    }

    console.log("----------------------------------------")
    console.log("0. Kembali")
    console.log("----------------------------------------")

    let menu = parseInt(input.question("Pilih promo untuk diklaim: "))
    let kodeItem = iAsli[menu]
    let itemPromo = jualan.daftarPromo[kodeItem]

    if (menu == 0) {
        clear()
    } else if (typeof itemPromo != "undefined") {
        console.log("\n")

        if (member.poin >= itemPromo.poinDiharapkan) {
            if (konfirmasi(`Klaim promo ${itemPromo.hadiah} (${itemPromo.poinDiharapkan} poin)`)) {
                member.daftarPromoDiklaim[kodeItem] = itemPromo
                let poinLama = member.poin

                member.poin -= itemPromo.poinDiharapkan

                clear()
                console.log(`===Selamat, ${member.nama}. Kamu berhasil memenangkan ${itemPromo.hadiah}===`)
                console.log(`===Poin kamu sekarang adalah ${member.poin} (${poinLama} - ${itemPromo.poinDiharapkan})===\n\n`)
            } else {
                clear()
            }
        } else {
            clear()
            console.log(`Oops! Poin kamu tidak cukup. Kamu perlu ${itemPromo.poinDiharapkan - member.poin} poin lagi untuk memenangkan ${itemPromo.hadiah}\n\n`)
        }
    } else {
        clear()
    }

    if (menu != 0) {
        klaimPromo(member, jualan)
    }
}
