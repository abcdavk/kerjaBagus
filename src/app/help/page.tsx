import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import FaqItem from "@/app/components/FaqItem";

type Faqs = {
  question: string;
  answer: ReactNode;
};

const faqs: Faqs[] = [
  {
    question: "Syarat & Ketentuan Penggunaan",
    answer: (
      <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
        <div>
          <h1 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            A. Bagi Pekerja / Freelancer
          </h1>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Kejujuran Profil/Lapak:</strong> Informasi keahlian, tarif
              jasa, dan portofolio/foto hasil kerja yang ditampilkan harus jujur
              dan asli milik sendiri. Dilarang mencantumkan keahlian palsu yang
              berisiko merugikan pemberi kerja.
            </li>
            <li>
              <strong>Tanggung Jawab Pekerjaan:</strong> Pekerja wajib
              menyelesaikan proyek atau pekerjaan sesuai dengan kesepakatan awal
              dengan klien/UMKM. Jika terjadi kendala atau keterlambatan,
              pekerja wajib menginformasikannya secara sopan.
            </li>
            <li>
              <strong>Sikap & Etika:</strong> Selalu berkomunikasi dengan sopan
              dan profesional. Dilarang melakukan tindakan provokatif, penipuan,
              atau meminta pembayaran di luar kesepakatan.
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            B. Bagi Pemilik Usaha / UMKM (Client)
          </h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Kejelasan Rincian Proyek:</strong> Deskripsi lowongan,
              beban kerja, serta besaran imbalan/gaji/upah borongan harus
              dicantumkan secara transparan dan masuk akal.
            </li>
            <li>
              <strong>Komitmen Pembayaran:</strong> Pemilik usaha wajib membayar
              hak pekerja tepat waktu sesuai dengan nominal dan metode
              pembayaran yang disepakati bersama.
            </li>
            <li>
              <strong>Larangan Lowongan Ilegal:</strong> Dilarang memasang
              lowongan kerja palsu, tawaran investasi bodong, perjudian,
              multi-level marketing (MLM) tersembunyi, atau kegiatan melanggar
              hukum.
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  {
    question: "Kebijakan Privasi (Keamanan Data)",
    answer: (
      <div className="space-y-3 text-slate-700 text-lg leading-relaxed">
        <p>Keamanan data Anda adalah prioritas utama di KerjaBagus</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Data yang Kami Kumpulkan:</strong> Informasi pendaftaran
            (Nama, email, WhatsApp, lokasi kota) serta foto portofolio dan
            rincian keahlian/tarif jasa.
          </li>
          <li>
            <strong>Penggunaan Data Anda:</strong> Digunakan untuk menghubungkan
            Anda secara langsung dengan calon klien/pekerja dan mengirimkan
            notifikasi tawaran proyek harian. Kami{" "}
            <strong>TIDAK AKAN PERNAH</strong> menjual data Anda ke pihak
            ketiga.
          </li>
          <li>
            <strong>Akses Kontak WhatsApp:</strong> Nomor WhatsApp yang Anda
            daftarkan dipublikasikan di halaman profil/proyek agar calon mitra
            dapat menghubungi Anda secara langsung (*direct chat*).
          </li>
        </ul>
      </div>
    ),
  },

  {
    question: "FAQ & Bantuan Umum",
    answer: (
      <div className="space-y-5 text-slate-700 text-lg leading-relaxed">
        {/* PEKERJA */}
        <div>
          <h4 className="font-bold text-emerald-800 text-xl mb-2">
            Bantuan untuk Pekerja / Freelancer
          </h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-slate-900">
                Apakah mendaftar dan mencari proyek di KerjaBagus gratis?
              </p>
              <p className="text-slate-600">
                <strong>Ya, 100% Gratis!</strong> Anda bisa mendaftar, membuat
                Lapak Jasa/Kartu Nama Digital, dan mencari proyek harian tanpa
                dipungut biaya pendaftaran.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Bagaimana cara membuat &quot;Lapak Jasa&quot; agar dilirik calon
                klien?
              </p>
              <p className="text-slate-600">
                Masuk ke akun Anda &gt; Klik{" "}
                <strong>&quot;Buka Lapak Jasa&quot;</strong> &gt; Masukkan
                keahlian, lokasi, serta foto hasil kerja terbaik Anda &gt;
                Bagikan link ke status WhatsApp atau media sosial Anda!
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {" "}
                Bagaimana jika klien tidak membayar atau menghilang?
              </p>
              <p className="text-slate-600">
                Selalu buat kesepakatan pembagian pembayaran di awal (misal: DP
                30% - 50%), simpan bukti chat/pengerjaan, dan laporkan pengguna
                bermasalah melalui tombol <strong>Lapor Akun</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* CLIENT / UMKM */}
        <div>
          <h4 className="font-bold text-amber-800 text-xl mb-2">
            Bantuan untuk UMKM / Pemilik Usaha
          </h4>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-slate-900">
                Bagaimana cara memasang lowongan proyek?
              </p>
              <p className="text-slate-600">
                Klik tombol <strong>&quot;Pasang Lowongan&quot;</strong> di
                halaman utama, isi judul kebutuhan kerja, kriteria singkat,
                lokasi, dan budget/upah yang ditawarkan.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {" "}
                Berapa lama proses pemasangan lowongan?
              </p>
              <p className="text-slate-600">
                Sangat cepat! Kurang dari 2 menit dan lowongan Anda akan
                langsung aktif disaksikan oleh ribuan pekerja lokal.
              </p>
            </div>
          </div>
        </div>

        {/* KTIPS */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <h4 className="font-bold text-red-800 text-xl mb-1 flex items-center gap-1.5">
            <span>Tips Transaksi & Keamanan Penting:</span>
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-lg text-red-700 mt-2">
            <li>
              <strong>
                Pekerja TIDAK BOLEH diminta bayar uang muka/seragam/administrasi
                saat melamar.
              </strong>{" "}
              Jika ada yang meminta uang saat melamar, itu 100% penipuan!
            </li>
            <li>
              Gunakan pembayaran bertahap (DP & Pelunasan) berdasarkan progres
              kerja.
            </li>
          </ul>
        </div>
      </div>
    ),
  },

  {
    question: "Kontak Bantuan Langsung",
    answer: (
      <div className="space-y-3 text-slate-700 text-lg leading-relaxed">
        <p>
          Butuh bantuan lebih lanjut atau ingin melaporkan indikasi penipuan?
          Tim KerjaBagus siap membantu Anda:
        </p>

        <p className="flex items-center gap-2">
          <strong>WhatsApp Bantuan:</strong> +62 812-XXXX-XXXX (Senin - Sabtu,
          08.00 - 17.00 WIB)
        </p>
        <p className="flex items-center gap-2">
          <strong>Email Bantuan:</strong> bantuan@kerjabagus.com
        </p>
        <p className="flex items-center gap-2">
          <strong>Kantor:</strong> KerjaBagus HQ - Jakarta, Indonesia
        </p>
      </div>
    ),
  },
];

export default function Help() {
  return (
    <div className="w-full py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Informasi & Panduan
      </h1>
      <FaqItem faqs={faqs} />
    </div>
  );
}
