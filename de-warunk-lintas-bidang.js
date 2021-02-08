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

export function tampilkanJudul(judul, dekorasi = "»", dekorasiSpasi = "·", padding = true, lebarMinimal = 50) {
    if (judul) {
        if (padding) {
            judul = `  ${judul}  `
        }

        let lebarDekorasi = judul.length
        let teksDekorasi = ""
        let teksDekorasiSpasi = ""

        if (lebarDekorasi < lebarMinimal) {
            lebarDekorasi = lebarMinimal
        }

        for (let i = 1; i <= lebarDekorasi; i++) {
            teksDekorasi += dekorasi
        }

        if (dekorasi) {
            console.log(teksDekorasi)
        }

        if (dekorasiSpasi) {
            let lebarSpasi = parseInt((lebarDekorasi - judul.length) / 2)

            for (let i = 1; i <= lebarSpasi; i++) {
                teksDekorasiSpasi += dekorasiSpasi
            }

            if (!dekorasi && lebarSpasi == 0) {
                judul = `${dekorasiSpasi}${judul}${dekorasiSpasi}`
            }
        }

        console.log(`${teksDekorasiSpasi}${judul}${teksDekorasiSpasi}`)

        if (dekorasi) {
            console.log(teksDekorasi)
        }
    }
}

export function konfirmasi(judul = null, pertanyaan = "Lanjutkan") {
    let lanjut
    let jadi = false

    do {
        tampilkanJudul(judul)
        lanjut = input.question(`${pertanyaan} (YA/BATAL): `).toLowerCase()
        console.log("")
    } while (lanjut != "ya" && lanjut != "batal")

    if (lanjut == "ya") {
        jadi = true
    }

    return jadi
}

export function jeda() {
    input.question("Tekan enter untuk lanjutkan...", {
        hideEchoBack: true,
        mask: ""
    })
    clear()
}

export function inputKonfirmasi(inputLama, namaData) {
    tampilkanJudul(`Ubah ${namaData[0].toLowerCase()}${namaData.slice(1)}`)
    console.log("X. Batal")
    tampilkanJudul("-", null, "-", false)

    let jadi = false
    let hasil = input.question(`${namaData} baru: `)
    clear()

    if (hasil.toLowerCase() == "x") {
        hasil = inputLama
    } else {
        console.log(`${namaData} berhasil diubah \n\n`)
    }

    return hasil
}

export function klaimPromo(member, jualan) {
    let waktu = new Date()
    let i = 1
    let iAsli = [""]

    tampilkanJudul(`Klaim promo ${namaBulan[waktu.getMonth()]} ${waktu.getFullYear()}`)
    console.log(`Hai ${member.nama}, poin kamu adalah ${member.poin}`)
    console.log("Ayo tambah poinmu untuk menangkan:\n")

    jualan.bersihkanPromoLama()
    member.bersihkanKlaimPromoLama()
    tampilkanJudul("Promo-promo belum diklaim", null, "-")

    for (const kode in jualan.daftarPromo) {
        if (typeof member.daftarPromoDiklaim[kode] == "undefined") {
            let item = jualan.daftarPromo[kode]

            console.log(`|${i}. ${item.hadiah}`)
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

        console.log(`| ${item.hadiah}`)
        console.log(`| Poin diharapkan: ${item.poinDiharapkan}`)

        if (item.syaratTambahan) {
            console.log(`| Syarat tambahan: ${item.syaratTambahan}`)
        }

        console.log("")
    }

    tampilkanJudul("0. Kembali", "-", null, false)

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
                tampilkanJudul(`Selamat, ${member.nama}. Kamu berhasil memenangkan ${itemPromo.hadiah}`, null, "=")
                tampilkanJudul(`Poin kamu sekarang adalah ${member.poin} (${poinLama} - ${itemPromo.poinDiharapkan})`, null, "=")
                console.log("\n")
            } else {
                clear()
            }
        } else {
            clear()
            tampilkanJudul(`Oops! Poin kamu tidak cukup. Kamu perlu ${itemPromo.poinDiharapkan - member.poin} poin lagi untuk memenangkan ${itemPromo.hadiah}`, null, "=")
        }
    } else {
        clear()
    }

    if (menu != 0) {
        klaimPromo(member, jualan)
    }
}

export function hitungTotalDiskonHarga(itemJualan, banyak, i = 0) {
    let totalDiskon = itemJualan.hargaJual * itemJualan.persenDiskon / 100
    let totalHarga = (itemJualan.hargaJual - totalDiskon) * banyak

    if (i != -1) {
        let notif = `${itemJualan.nama}`

        if (i >= 1) {
            notif = `${i}. ` + notif

            if (notif.length < 8) {
                notif += "\t\t"
            } else if (notif.length < 16) {
                notif += "\t"
            }
        }

        notif += `\tRp.${itemJualan.hargaJual} (diskon Rp.${totalDiskon}) x ${banyak} = Rp.${totalHarga}`

        console.log(notif)
    }

    return [totalDiskon, totalHarga]
}