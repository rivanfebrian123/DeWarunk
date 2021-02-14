/* lainnya.js
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

export const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
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