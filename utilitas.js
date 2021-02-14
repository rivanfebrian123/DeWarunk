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
import chalk from 'chalk'
import clear from 'console-clear'

export const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
    "Agustus", "September", "Oktober", "November", "Desember"
]

export function jeda() {
    input.question(chalk.blue.bold("👇️ Tekan enter untuk lanjutkan..."), {
        hideEchoBack: true,
        mask: ""
    })
    clear()
}

export function tanya(pertanyaan) {
    return input.question(chalk.blue.bold(pertanyaan))
}

export function tampilkanJudul(judul, tipe = "kepala", dekorasi = "»", dekorasiSpasi = "·", padding = true, lebarMinimal = 50) {
    let kapurDekorasi
    let kapurIsi

    switch (tipe) {
    case "polos":
        kapurDekorasi = chalk.blue
        kapurIsi = chalk
        break
    case "kepala":
        kapurDekorasi = chalk.blue
        kapurIsi = chalk.blue.bold
        break
    case "pemberitahuanGagal":
        kapurDekorasi = chalk.red
        kapurIsi = chalk.red.bold
        break
    case "pemberitahuanSukses":
        kapurDekorasi = chalk.green
        kapurIsi = chalk.green.bold
        break
    }

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
            console.log(kapurDekorasi(teksDekorasi))
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

        console.log(`${kapurDekorasi(teksDekorasiSpasi)}${kapurIsi(judul)}${kapurDekorasi(teksDekorasiSpasi)}`)

        if (dekorasi) {
            console.log(kapurDekorasi(teksDekorasi))
        }
    }
}

export function konfirmasi(judul = null, pertanyaan = "Lanjutkan") {
    let lanjut
    let jadi = false

    do {
        tampilkanJudul(judul)
        lanjut = tanya(`❓️ ${pertanyaan} (YA/KEMBALI): `).toLowerCase()
        console.log("")
    } while (lanjut != "ya" && lanjut != "kembali")

    if (lanjut == "ya") {
        jadi = true
    }

    return jadi
}