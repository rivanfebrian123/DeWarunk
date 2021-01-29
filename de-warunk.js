import input from 'readline-sync'
import clear from 'console-clear'
import {
    Member,
    Sesi
} from './de-warunk-data-util.js'


class DWTransaksi {
    sesi
    jualan = []

    constructor(sesi, jualan) {
        this.sesi = sesi
        this.jualan = jualan
    }

    mulai() {
        if (!this.sesi.valid) {
            console.log("====Transaksi baru===")
            this.sesi.aktifkan("==Kode member tidak ditemukan, coba lagi==", "jikaTiada")
        }

        if (this.sesi.valid) {
            console.log(`==Eh, si ${this.sesi.member.nama} balik lagi!==`)
            console.log("=====================")
            console.log("Transaksi baru")
            console.log("=====================")
            console.log("1. Tambah item")
            console.log("2. Kurangi item")
            console.log("3. Proses dan cetak transaksi")
            console.log("4. Cek poin dan promo")
            console.log("X. Batalkan transaksi")

            let menu = input.question("Pilih menu: ")
            clear()

            switch (menu) {
            case "1":
                this.tambahKurangiItem("tambah")
                break
            case "2":
                this.tambahKurangiItem("kurangi")
                break
            case "3":
                this.prosesCetak()
                break
            case "4":
                this.cekPoinPromoMember()
                break
            case "X":
                this.sesi.nonaktifkan()
                break
            }

            if (menu != "X") {
                this.mulai()
            }
        }
    }

    tampilkanItem(penuhSebagian) {
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

    tambahKurangiItem(opsi) {
        let iAsli

        console.log("=====================")
        if (opsi == "tambah") {
            console.log("Tambah item")
            console.log("=====================")
            iAsli = this.tampilkanItem("penuh")
        } else {
            console.log("Kurangi item")
            console.log("=====================")
            iAsli = this.tampilkanItem("sebagian")
        }

        let item = parseInt(input.question("Pilih item: "))

        if ((item > 0) && (item <= iAsli.length)) {
            let dataItem = this.jualan[iAsli[item - 1]]
            let jumlah

            if (opsi == "tambah") {
                jumlah = parseInt(input.question("Banyaknya yang ditambahkan: "), 10)
            } else {
                jumlah = parseInt(input.question("Banyaknya yang dikurangi: "), 10)
            }

            clear()

            if (!isNaN(jumlah)) {
                if (opsi == "tambah") {
                    dataItem[2] += jumlah
                    console.log("==Item berhasil ditambah==")
                } else {
                    dataItem[2] -= jumlah
                    console.log("==Item berhasil dikurangi==")
                }

                console.log(`${dataItem[0]} - Rp.${dataItem[1]} x ${dataItem[2]} = Rp.${dataItem[1]*dataItem[2]}`)
            }

            this.tambahKurangiItem(opsi)
        } else {
            clear()

            if (item != 0) {
                this.tambahKurangiItem(opsi)
            }
        }
    }

    prosesCetak() {
        console.log("==========================")
        console.log("Proses dan cetak transaksi")
        console.log("==========================")

        this.tampilkanItem("sebagian")
    }
}


class DWMember {
    sesi

    constructor(sesi) {
        this.sesi = sesi
    }

    mulai() {
        console.log("===================")
        console.log("Member")
        console.log("===================")
        console.log("1. Tambah member")
        console.log("2. Edit / hapus member")
        console.log("3. Cek poin dan promo member")
        console.log("4. Cek riwayat transaksi member")
        console.log("5. Lihat semua daftar member")
        console.log("0. Kembali")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.tambahMember()
            break
        case "2":
            this.sesi.nonaktifkan()
            this.editMember()
            break
        case "3":
            this.cekPoinPromoMember()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }


    tambahMember() {
        console.log("===Tambah member===")

        let status = this.sesi.aktifkan("==Kode member sudah digunakan, silakan coba lagi==", "jikaAda")

        if (status == "tiada") {
            console.log("=================")
            console.log("Tambah member")
            console.log("=================")
            this.sesi.grupMember[this.sesi.tag] = new Member(this.sesi.tag,
                input.question("Nama: "), input.question("No. WA: "), 0)
            clear()
            console.log("==Member berhasil ditambah==")
        }
    }

    editMember() {
        if (!this.sesi.valid) {
            console.log("===Edit member===")
            this.sesi.aktifkan("==Member tidak ditemukan, coba lagi==", "jikaTiada")
        }

        if (this.sesi.valid) {
            console.log("=====================")
            console.log("Edit member")
            console.log("=====================")
            console.log(`1. Ubah kode member (${this.sesi.member.kode})`)
            console.log(`2. Ubah nama (${this.sesi.member.nama})`)
            console.log(`3. Ubah no. WA (${this.sesi.member.noWA})`)
            console.log(`4. Hapus member (${this.sesi.member.kode}. ${this.sesi.member.nama})`)
            console.log("0. Kembali")

            let notif = ""
            let menu = input.question("Pilih menu: ")

            switch (menu) {
            case "1":
                notif = "===Kode member berhasil diubah==="
                let kodeLama = this.sesi.member.kode

                console.log("===Ubah kode member===")
                this.sesi.member.kode = input.question("Kode member baru: ")
                this.sesi.grupMember[this.sesi.member.kode] = this.sesi.member
                delete this.sesi.grupMember[kodeLama]
                break
            case "2":
                notif = "===Nama berhasil diubah==="
                console.log("===Ubah nama===")
                this.sesi.member.nama = input.question("Nama baru: ")
                break
            case "3":
                notif = "===No. WA berhasil diubah==="
                console.log("===Ubah no. WA===")
                this.sesi.member.noWA = input.question("No. WA baru: ")
                break
            case "4":
                notif = `===Member "${this.sesi.member.nama}" berhasil dihapus===`
                delete this.sesi.grupMember[this.sesi.member.kode]
                this.sesi.nonaktifkan()
                break
            case "0":
                this.sesi.nonaktifkan()
                break
            }

            clear()

            if (menu != "0") {
                console.log(notif)
                this.editMember()
            }
        }
    }

    cekPoinPromoMember() {
        console.log("=========================")
        console.log("Cek poin dan promo member")
        console.log("=========================")
    }
}


class DeWarunk {
    dwTransaksi
    dwMember

    grupMember = []
    jualan = []
    sesi

    constructor() {
        this.jualan = [
            ["Kopi espreso", 5000, 0],
            ["Susu jahe", 8000, 0],
            ["Kopi lampung", 3000, 0],
            ["Kopi energi", 6000, 0],
            ["Susu kambing", 9000, 0],
            ["Wedang jahe", 2000, 0],
            ["Kopi starbak", 12000, 0],
            ["Kopi gula aren", 4000, 0]
        ]
        this.grupMember["RV"] = new Member("RV", "Rivan", "087767777733", 30)
        this.sesi = new Sesi(this.grupMember)
        this.sesi.nonaktifkan()

        this.dwTransaksi = new DWTransaksi(this.sesi, this.jualan)
        this.dwMember = new DWMember(this.sesi)
    }

    mulai() {
        console.log("=====================")
        console.log("DeWarunk - Kafe Gen-Z")
        console.log("=====================")
        console.log("1. Transaksi")
        console.log("2. Member")
        console.log("3. Jualan")
        console.log("0. Keluar")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.dwTransaksi.mulai(this.sesi)
            break
        case "2":
            this.dwMember.mulai()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }
}


const apl = new DeWarunk()
clear()
apl.mulai()
