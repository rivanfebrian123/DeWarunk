import input from 'readline-sync'
import clear from 'console-clear'
import { Member, Sesi} from './de-warunk-data-util.js'

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
            this.sesi.aktifkan("", "==Kode member tidak ditemukan==")
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
            
            switch (input.question("Pilih menu: ")) {
                case "1":
                    clear()
                    this.tambahKurangiItem("tambah")
                    break
                case "2":
                    clear()
                    this.tambahKurangiItem("kurangi")
                    break
                case "3":
                    clear()
                    this.prosesCetak()
                    break
                case "4":
                    clear()
                    this.cekPoinPromoMember()
                    break
                case "X":
                    this.sesi.nonaktifkan()
                    clear()
                    break
                default:
                    clear()
                    this.mulai()
                    break
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
    
    tambahKurangiItem(tambahKurangi) {
        let iAsli

        console.log("=====================")
        if (tambahKurangi == "tambah") {
            console.log("Tambah item")
            console.log("=====================")
            iAsli = this.tampilkanItem("penuh")
        } else {
            console.log("Kurangi item")
            console.log("=====================")
            iAsli = this.tampilkanItem("sebagian")
        }
        
        let item = parseInt(input.question("Pilih item: "))
        
        if (item == 0) {
            clear()
            this.mulai(this.sesi)
        } else if ((item > 0) && (item <= iAsli.length)) {
            let dataItem = this.jualan[iAsli[item-1]]
            
            if (tambahKurangi == "tambah") {
                let jumlah = parseInt(input.question("Banyaknya yang ditambahkan: "))
                dataItem[2] += jumlah

                clear()
                console.log("==Item berhasil ditambah==")
            } else {
                let jumlah = parseInt(input.question("Banyaknya yang dikurangi: "))
                dataItem[2] -= jumlah
                
                clear()
                console.log("==Item berhasil dikurangi==")
            }
            
            console.log(`${dataItem[0]} - Rp.${dataItem[1]} x ${dataItem[2]} = Rp.${dataItem[1]*dataItem[2]}`)

            this.tambahKurangiItem(tambahKurangi)
        } else {
            clear()
            this.tambahKurangiItem(tambahKurangi)
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
        
        switch (input.question("Pilih menu: ")) {
            case "1":
                clear()
                this.tambahMember()
                break
            case "2":
                clear()
                this.sesi.nonaktifkan()
                this.editMember()
                break
            case "3":
                clear()
                this.cekPoinPromoMember()
                break
            case "0":
                clear()
                break
            default:
                clear()
                this.mulai()
                break
        }
    }
    

    tambahMember() {
        console.log("===Tambah member===")
 
        let status = this.sesi.aktifkan("==Kode member sudah digunakan, silakan coba lagi==", "")
        
        if (status == "ada") {
            this.tambahMember()
        } else if (status == "tiada") {
            console.log("=================")
            console.log("Tambah member")
            console.log("=================")
            this.sesi.grupMember[this.sesi.tag] = new Member(this.sesi.tag,
                input.question("Nama: "), input.question("No. WA: "), 0)
            clear()
            console.log("==Member berhasil ditambah==")
            this.mulai()
        } else {
            clear()
            this.mulai()
        }
    }
    
    editMember() {
        if (!this.sesi.valid) {
            let status = "tiada"
            
            while (status == "tiada") {
                console.log("===Edit member===")
                status = this.sesi.aktifkan("", "==Member tidak ditemukan, coba lagi==")
            }
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
            
            switch (input.question("Pilih menu: ")) {
                case "1":
                    console.log("===Ubah kode member===")
                    
                    let kodeLama = this.sesi.member.kode
                    
                    this.sesi.member.kode = input.question("Kode member baru: ")
                    this.sesi.grupMember[this.sesi.member.kode] = this.sesi.member
                    delete this.sesi.grupMember[kodeLama]
                    
                    clear()
                    console.log("===Kode member berhasil diubah===")
                    this.editMember()
                    break
                case "2":
                    console.log("===Ubah nama===")
                    this.sesi.member.nama = input.question("Nama baru: ")
                    clear()
                    console.log("===Nama berhasil diubah===")
                    this.editMember()
                    break
                case "3":
                    console.log("===Ubah no. WA===")
                    this.sesi.member.noWA = input.question("No. WA baru: ")
                    clear()
                    console.log("===No. WA berhasil diubah===")
                    this.editMember()
                    break
                case "4":
                    delete this.sesi.member
                    clear()
                    console.log("===Member berhasil dihapus===")
                    this.editMember()
                    break
                case "0":
                    this.sesi.nonaktifkan()
                    clear()
                    break
                default:
                    clear()
                    this.editMember()
                    break
            }
        } else {
            this.mulai()
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
        
        switch (input.question("Pilih menu: ")) {
            case "1":
                clear()
                this.dwTransaksi.mulai(this.sesi)
                this.mulai()
                break
            case "2":
                clear()
                this.dwMember.mulai()
                this.mulai()
                break
            case "0":
                break
            default:
                clear()
                this.mulai()
                break
        }
    }
}


const apl = new DeWarunk()
clear()
apl.mulai()
