# Sistem Rekomendasi Jurusan Kuliah Siswa SMA

Repositori ini berisi implementasi sistem rekomendasi jurusan kuliah untuk siswa SMA berdasarkan nilai rapor, menggunakan algoritma **Naive Bayes** dan **Euclidean Distance**. Sistem ini dikembangkan sebagai bagian dari penelitian yang bertujuan untuk membantu siswa dalam memilih jurusan yang sesuai dengan kemampuan akademik mereka, sehingga meningkatkan peluang diterima di perguruan tinggi melalui jalur seleksi tanpa tes.


![Preview](https://github.com/iamyourdre/sistem-rekomendasi-jurusan-kuliah/blob/main/preview.png?raw=true)

## 🏛 Latar Belakang
Banyak siswa SMA mengalami kesulitan dalam memilih jurusan kuliah yang sesuai dengan minat dan kemampuannya, yang berdampak pada tingkat kelulusan yang rendah dalam seleksi nasional masuk perguruan tinggi (PTN). Oleh karena itu, sistem ini dirancang untuk menganalisis pola nilai rapor siswa dan memberikan rekomendasi jurusan berdasarkan data historis siswa yang telah berhasil diterima di PTN.

## 🔍 Metode
- **Naive Bayes Classifier**: Digunakan untuk mengklasifikasikan jurusan dengan probabilitas tertinggi berdasarkan pola nilai rapor siswa.
- **Euclidean Distance**: Digunakan untuk menemukan jurusan dengan pola nilai yang paling mirip dengan siswa yang telah berhasil diterima sebelumnya.
- **Leave-One-Out Cross Validation (LOOCV)**: Digunakan untuk menguji keakuratan model dengan dataset yang terbatas.
- **Precision Calculation**: Digunakan untuk mengevaluasi tingkat keberhasilan rekomendasi.

## ⚙️ Teknologi yang Digunakan
- **Backend**: Node.js dengan Express.js
- **Frontend**: React.js dengan Tailwind CSS
- **Database**: MySQL
- **Authentication**: NextAuth.js dengan JWT dan CSRF Token

## 📌 Fitur Utama
- Meminta input berupa nilai rapor siswa
- Memberi informasi tentang mata pelajaran yang perlu ditingkatkan dari siswa
- Mengembangkan model klasifikasi dengan data sampel yang sangat minim melalui pertimbangan variabel-variabel kinerja akademik siswa, seperti nilai matematika, bahasa Inggris, sains, dan lainnya, untuk merumuskan rekomendasi jurusan kuliah
- Memberikan informasi tentang mata pelajaran mana saja yang perlu
dimaksimalkan oleh siswa

## 📖 Referensi
Penelitian ini merupakan bagian dari skripsi saya yang berjudul **"Sistem Rekomendasi Jurusan Kuliah Siswa SMA Berdasarkan Nilai Rapor dengan Algoritma Naive Bayes"**, yang dapat diakses melalui [repository Universitas Sriwijaya](https://repository.unsri.ac.id/156310/3/RAMA_55201_09021382025164_0009019002_0021128905_01_front_ref.pdf).

# Installation (ENG)

In the project directory, prepare for backend prerequisites:

Open `backend/models/UserModel.js` and then check line 60 - 68.\
Don't forget to update the `.env` values on `backend/models/.env`.

After that, install the backend package:

```
cd backend
npm install
nodemon index
```

Next, prepare for frontend prerequisites:

```
cd frontend
npm install
nodemon index
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
