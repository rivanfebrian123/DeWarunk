import input from 'readline-sync'
import clear from 'console-clear'


export function tampilkanItem(penuhSebagian) {
    let totalBelanja = 0
    let i = 0
    let iAsli = []

    for (const [x, elemen] of this.jualan.entries()) {
        if ((penuhSebagian == "penuh") || (elemen[2] != 0)) {
            i++
            iAsli.push(x)
            console.log(`${i}. ${elemen[0]} - Rp.${elemen[1]} x ${elemen[2]} = Rp.${elemen[1]*elemen[2]}`)
            totalBelanja += (elemen[1] * elemen[2])
        }
    }

    console.log("0. Kembali")
    console.log(`===Total belanja kamu: Rp.${totalBelanja}===`)
    console.log(`===Poin belanja kamu: ${parseInt(totalBelanja/1000/2)}===`)

    return iAsli
}


export class Sesi {
    grupMember
    valid
    member
    tag

    constructor(grupMember) {
        this.grupMember = grupMember
        this.valid = false
        this.tag = ""
    }

    aktifkan(pesan = "", kondisiUlangi = "tidak") {
        let hasil
        let ulangi

        do {
            console.log("X. Batal")
            console.log("--------------------------")
            this.tag = input.question("Kode member: ")

            if (this.tag == "X") {
                hasil = "batal"
            } else if (typeof (this.grupMember[this.tag]) == "undefined") {
                hasil = "tiada"
                this.valid = false
            } else {
                hasil = "ada"
                this.valid = true
                this.member = this.grupMember[this.tag]
            }

            if ((hasil == "ada" && kondisiUlangi == "jikaAda") || (hasil == "tiada" && kondisiUlangi == "jikaTiada")) {
                ulangi = true
                console.log("\n")
                console.log(pesan)
                console.log("==========================")
            } else {
                ulangi = false
            }
        } while (ulangi)

        clear()

        return hasil
    }

    nonaktifkan(hapusGrupMember = false) {
        if (hapusGrupMember) {
            this.grupMember = false
        }

        this.member = false
        this.tag = ""
        this.valid = false
    }
}


export class Member {
    kode
    nama
    noWA
    poin
    riwayatTransaksi = []

    constructor(kode, nama, noWA, poin) {
        this.kode = kode
        this.nama = nama
        this.noWA = noWA
        this.poin = poin
    }

    edit() {
        this.kode = input.question("Kode member: ")
        this.nama = input.question("Nama: ")
        this.noWA = input.question("No. WA: ")
        console.log("==Data member berhasil diubah==")
        clear()
    }
}


class Jualan {
    kode
    nama
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    constructor(kode, nama, biayaProduksi, lamaProduksi, hargaJual, persenDiskon) {
        this.kode = kode
        this.nama = nama
        this.biayaProduksi = biayaProduksi
        this.lamaProduksi = lamaProduksi
        this.hargaJual = hargaJual
        this.persenDiskon = persenDiskon
    }
}


class ItemStruk {
    kode
    menu
    banyak
    jumlahTotal

    constructor(kode, menu, banyak, jumlahTotal) {
        this.kode = kode
        this.menu = menu
        this.banyak = banyak
        this.jumlahTotal = jumlahTotal
    }
}


class Struk {
    waktu
    item = []
    totalBelanja
    poin
    totalPoin
}
