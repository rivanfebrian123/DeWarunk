import input from 'readline-sync'
import clear from 'console-clear'


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
}


export class Sesi {
    daftarMember
    valid
    member
    tag

    constructor(daftarMember) {
        this.daftarMember = daftarMember
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
            } else if (typeof this.daftarMember[this.tag] == "undefined") {
                hasil = "tiada"
                this.valid = false
            } else {
                hasil = "ada"
                this.valid = true
                this.member = this.daftarMember[this.tag]
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

    nonaktifkan(hapusDaftarMember = false) {
        if (hapusDaftarMember) {
            this.daftarMember = false
        }

        this.member = false
        this.tag = ""
        this.valid = false
    }

    ubahKodeMember() {
        if (!this.valid) {
            this.aktifkan()
        }

        if (this.valid) {
            let kodeLama = this.member.kode

            console.log("===Ubah kode member===")
            this.member.kode = input.question("Kode member baru: ")
            this.daftarMember[this.member.kode] = this.member
            delete this.daftarMember[kodeLama]

            console.log("===Kode member berhasil diubah===")
        }
    }

    ubahNamaMember() {
        if (!this.valid) {
            this.aktifkan()
        }

        if (this.valid) {
            console.log("===Ubah nama===")
            this.member.nama = input.question("Nama baru: ")
            console.log("===Nama berhasil diubah===")
        }
    }

    ubahNoWAMember() {
        if (!this.valid) {
            this.aktifkan()
        }

        if (this.valid) {
            console.log("===Ubah no. WA===")
            this.member.noWA = input.question("No. WA baru: ")
            console.log("===No. WA berhasil diubah===")
        }
    }

    tambahMember() {
        console.log("===Tambah member===")

        let status = this.aktifkan("==Kode member sudah digunakan, silakan coba lagi==", "jikaAda")

        if (status == "tiada") {
            console.log("=================")
            console.log("Tambah member")
            console.log("=================")
            this.daftarMember[this.tag] = new Member(this.tag,
                input.question("Nama: "), input.question("No. WA: "), 0)
            clear()
            console.log("==Member berhasil ditambah==")
        }
    }

    hapusMember() {
        if (!this.valid) {
            this.aktifkan()
        }

        if (this.valid) {
            notif = `===Member "${this.member.nama}" berhasil dihapus===`
            delete this.daftarMember[this.member.kode]
            this.nonaktifkan()
            console.log(notif)
        }
    }
}


export class ItemJualan {
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


export class Jualan {
    daftarJualan = []

    tampilkan() {
        console.log("==========================")
        console.log("Jualanku")
        console.log("==========================")
        console.log("No\t\tKode\t\tNama\t\tBiaya produksi\t\tLama produksi\t\tHarga jual\t\tPersen diskon")
        console.log("------------------------------------------------------------------------------------------")

        for (const [i, item] of this.daftarJualan.entries()) {
            console.log(`${i}\t\t${item.kode}\t\t${item.nama}\t\t${item.biayaProduksi}\t\t${item.lamaProduksi}\t\t${item.hargaJual}\t\t${item.persenDiskon}`)
        }
    }

    tambahJualan() {

    }
}


export class ItemTransaksi {
    itemJualan
    banyak
    totalDiskon
    totalHarga

    constructor(itemJualan, banyak, totalDiskon, totalHarga) {
        this.itemJualan = itemJualan
        this.banyak = banyak
        this.totalDiskon = totalDiskon
        this.totalHarga = totalHarga
    }
}


export class Transaksi {
    // istilah "item" di sini adalah item dari kelas ini, sedangkan "itemJualan"
    // adalah item dari kelas Jualan
    waktu
    daftarItem = []
    jualan
    totalBelanja = 0
    poin

    constructor(jualan) {
        this.waktu = new Date()
        this.jualan = jualan
    }

    hitungTotalDiskonHarga(itemJualan, banyak, i=0) {
        let totalDiskon = itemJualan.hargaJual * itemJualan.persenDiskon / 100
        let totalHarga = (itemJualan.hargaJual - totalDiskon) * banyak
        let notif = `${itemJualan.nama} - Rp.${itemJualan.hargaJual} (diskon Rp.${totalDiskon}) x ${banyak} = Rp.${totalHarga}`

        if (i >= 1) {
            notif = `${i}. ` + notif
        }

        if (i != -1) {
            console.log(notif)
        }

        return [totalDiskon, totalHarga]
    }

    tampilkan(tampilkanItemBelumDibeli) {
        let i = 1
        let iAsli = [""]
        let totalBelanja = 0

        if (tampilkanItemBelumDibeli) {
            console.log("---------Item2 belum dibeli-----------")
            for (const kode in this.jualan.daftarJualan) {
                if ((typeof kode != "undefined") && (typeof this.daftarItem[kode] == "undefined")) {
                    this.hitungTotalDiskonHarga(this.jualan.daftarJualan[kode], 0, i)
                    iAsli[i] = kode
                    i++
                }
            }
        }

        console.log("---------Item2 sudah dibeli-----------")
        for (const kode in this.daftarItem) {
            if (typeof kode != "undefined") {
                let item = this.daftarItem[kode]

                let totalDiskonHarga = this.hitungTotalDiskonHarga(item.itemJualan, item.banyak, i)
                item.totalDiskon = totalDiskonHarga[0]
                item.totalHarga = totalDiskonHarga[1]

                totalBelanja += item.totalHarga
                iAsli[i] = item.itemJualan.kode
                i++
            }
        }

        console.log("--------------------------------------")
        console.log("0. Kembali")
        console.log("--------------------------------------")
        console.log(`===Total belanja kamu: Rp.${totalBelanja}===`)
        console.log(`===Poin belanja kamu: ${parseInt(totalBelanja/1000/2)}===`)

        return iAsli
    }

    tambahItem() {
        console.log("======================================")
        console.log("Tambah item")
        console.log("======================================")
        let iAsli = this.tampilkan(true)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined") {
            banyak = parseInt(input.question("Banyaknya yang ditambahkan: "))
            clear()

            if (banyak > 0) {
                let totalDiskonHarga

                if (typeof this.daftarItem[kodeItem] == "undefined") {
                    console.log("-------------Item baru------------")
                    totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak)
                    this.daftarItem[kodeItem] = new ItemTransaksi(itemJualan, banyak, totalDiskonHarga[0], totalDiskonHarga[1])
                } else {
                    let item = this.daftarItem[kodeItem]

                    console.log("--------------Dari----------------")
                    totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                    item.banyak += banyak
                    item.totalDiskon += totalDiskonHarga[0]
                    item.totalHarga += totalDiskonHarga[1]

                    console.log("-------------Menjadi--------------")
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                }

                console.log("====Item berhasil ditambahkan====\n\n")
            }

            this.tambahItem()
        } else {
            clear()
            this.tambahItem()
        }
    }

    kurangiItem() {
        console.log("=====================")
        console.log("Kurangi item")
        console.log("=====================")
        let iAsli = this.tampilkan(false)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if ((typeof itemJualan != "undefined") && (typeof this.daftarItem[kodeItem] != "undefined")) {
            let item = this.daftarItem[kodeItem]
            banyak = parseInt(input.question("Banyaknya yang dikurangi: "))
            clear()

            if ((banyak > 0) && (banyak < item.banyak)) {
                console.log("--------------Dari----------------")
                let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                item.banyak -= banyak
                item.totalDiskon -= totalDiskonHarga[0]
                item.totalHarga -= totalDiskonHarga[1]

                console.log("-------------Menjadi--------------")
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                console.log("====Item berhasil dikurangi====\n\n")
            } else if (banyak >= item.banyak) {
                delete this.daftarItem[kodeItem]
                console.log(`====Item ${itemJualan.nama} (${itemJualan.kode}) berhasil dihapus====`)
            }

            this.kurangiItem()
        } else {
            clear()
            this.kurangiItem()
        }
    }

    prosesCetak() {
        console.log("==========================")
        console.log("Proses dan cetak transaksi")
        console.log("==========================")
    }
}
