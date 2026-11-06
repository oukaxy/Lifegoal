/* ============================================================
 * LifeGoal — data.js
 * Sumber data: kategori (guild), rarity, level, achievements
 * ============================================================ */

window.LIFEGOAL = window.LIFEGOAL || {};

(function (G) {
  'use strict';

  /* ---------- Kategori / Guild ---------- */
  G.CATEGORIES = {
    karier:      { name: 'Jalan Kesatriaan',   icon: '⚔️', blurb: 'Karier & usaha' },
    kesehatan:   { name: 'Vitalitas',          icon: '🛡️', blurb: 'Kesehatan & kekuatan' },
    keuangan:    { name: 'Guild Saudagar',     icon: '💰', blurb: 'Harta & keuangan' },
    skill:       { name: 'Menara Ilmu',        icon: '📖', blurb: 'Skill & pengetahuan' },
    keluarga:    { name: 'Aliansi & Kerajaan', icon: '🏰', blurb: 'Keluarga & hubungan' },
    petualangan: { name: 'Penjelajahan',       icon: '🗺️', blurb: 'Jalan-jalan' },
  };

  /* ---------- Rarity ---------- */
  G.RARITIES = {
    biasa:      { label: 'Biasa',      color: '#9aa0a6' },
    langka:     { label: 'Langka',     color: '#5f9dd8' },
    epik:       { label: 'Epik',       color: '#a45de0' },
    legendaris: { label: 'Legendaris', color: '#e8a51f' },
  };

  /* ---------- Level (ambang XP kumulatif) ---------- */
  G.LEVELS = [
    { xp: 0,     title: 'Petualang Tak Bertuan' },
    { xp: 300,   title: 'Ksatria Muda' },
    { xp: 900,   title: 'Pengelana' },
    { xp: 1800,  title: 'Ksatria Perak' },
    { xp: 3200,  title: 'Pengawal Kerajaan' },
    { xp: 5000,  title: 'Baron' },
    { xp: 7200,  title: 'Panglima Perang' },
    { xp: 9800,  title: 'Pangeran' },
    { xp: 12800, title: 'Sang Raja' },
  ];

  /* ---------- Achievements ---------- */
  G.ACHIEVEMENTS = [
    /* == Jalan Kesatriaan (Karier) == */
    { id: 'panggilan-pertama',   cat: 'karier', rarity: 'biasa',      xp: 100,  icon: '💼',
      title: 'Panggilan Pertama',
      desc: 'Memegang senjata pertamamu: mendapatkan pekerjaan pertama di dunia nyata.' },
    { id: 'lencana-perak',       cat: 'karier', rarity: 'langka',     xp: 250,  icon: '🎖️',
      title: 'Lencana Perak',
      desc: 'Promosi pertama. Nama pada armormu mulai dikenal di seluruh kerajaan.' },
    { id: 'kapten-pasukan',      cat: 'karier', rarity: 'epik',       xp: 500,  icon: '🚩',
      title: 'Kapten Pasukan',
      desc: 'Dipercaya memimpin tim atau proyek dan membawa mereka menang.' },
    { id: 'sang-maestro',        cat: 'karier', rarity: 'legendaris', xp: 1000, icon: '🏆',
      title: 'Sang Maestro',
      desc: 'Keahlianmu diakui: karya atau namamu dirujuk dan dibicarakan orang lain.' },
    { id: 'raja-dagang',         cat: 'karier', rarity: 'legendaris', xp: 1200, icon: '🏪',
      title: 'Raja Dagang',
      desc: 'Mendirikan kerajaan bisnismu sendiri, dari nol hingga berdiri tegak.' },

    /* == Vitalitas (Kesehatan) == */
    { id: 'istirahat-sang-raja', cat: 'kesehatan', rarity: 'biasa',   xp: 100,  icon: '🌙',
      title: 'Istirahat Sang Raja',
      desc: 'Sebulan penuh tidur cukup dan teratur. Tubuhmu adalah kastil pertamamu.' },
    { id: 'fondasi-baja',        cat: 'kesehatan', rarity: 'langka',  xp: 250,  icon: '💪',
      title: 'Fondasi Baja',
      desc: '30 hari beruntun melatih tubuh tanpa jeda berarti.' },
    { id: 'benteng-imun',        cat: 'kesehatan', rarity: 'langka',  xp: 300,  icon: '🥗',
      title: 'Benteng Imun',
      desc: 'Setahun menjaga pola makan sehat dan medical check-up rutin.' },
    { id: 'jantung-naga',        cat: 'kesehatan', rarity: 'epik',    xp: 500,  icon: '🏃',
      title: 'Jantung Sang Naga',
      desc: 'Menaklukkan lari 10K atau tantangan fisik sederajat.' },
    { id: 'racun-dikubur',       cat: 'kesehatan', rarity: 'epik',    xp: 600,  icon: '🚫',
      title: 'Racun Dikubur',
      desc: 'Berhenti dari kebiasaan yang selama ini meracuni tubuhmu.' },

    /* == Guild Saudagar (Keuangan) == */
    { id: 'harta-pertama',       cat: 'keuangan', rarity: 'biasa',    xp: 150,  icon: '🪙',
      title: 'Harta Pertama',
      desc: 'Menabung 10 juta pertama dan menyimpannya di petimu.' },
    { id: 'bendahara-raja',      cat: 'keuangan', rarity: 'langka',   xp: 300,  icon: '📈',
      title: 'Bendahara Kerajaan',
      desc: 'Investasi rutin setahun penuh tanpa satu bulan pun bolong.' },
    { id: 'peti-nadir',          cat: 'keuangan', rarity: 'epik',     xp: 500,  icon: '🏦',
      title: 'Peti Nadir',
      desc: 'Dana darurat 6 bulan pengeluaran tersimpan aman di gudang kerajaan.' },
    { id: 'naga-dikalahkan',     cat: 'keuangan', rarity: 'epik',     xp: 600,  icon: '🐉',
      title: 'Naga Dikalahkan',
      desc: 'Utang lunas total. Naga penagih resmi tumbang.' },
    { id: 'tangga-emas',         cat: 'keuangan', rarity: 'legendaris', xp: 1000, icon: '💎',
      title: 'Tangga Emas',
      desc: 'Penghasilan pasif pertamamu mengalir masuk ke koil.' },

    /* == Menara Ilmu (Skill) == */
    { id: 'lentera-baru',        cat: 'skill', rarity: 'biasa',       xp: 100,  icon: '🕯️',
      title: 'Lentera Baru',
      desc: 'Menyalakan skill baru dari nol sampai benar-benar terpakai.' },
    { id: 'mantra-kedua',        cat: 'skill', rarity: 'langka',      xp: 250,  icon: '📜',
      title: 'Mantra Kedua',
      desc: 'Lulus sertifikasi atau menguasai bahasa baru.' },
    { id: 'gulungan-perguruan',  cat: 'skill', rarity: 'langka',      xp: 350,  icon: '🎓',
      title: 'Gulungan Perguruan',
      desc: 'Menyelesaikan pendidikan formal dan meraih gelar.' },
    { id: 'pustakawan-abadi',    cat: 'skill', rarity: 'epik',        xp: 400,  icon: '📚',
      title: 'Pustakawan Abadi',
      desc: 'Membaca 24 buku dalam setahun — dua gulungan tiap bulan.' },
    { id: 'ars-magica',          cat: 'skill', rarity: 'epik',        xp: 500,  icon: '🧪',
      title: 'Ars Magica',
      desc: 'Menguasai senjata utama bidangmu pada level expert.' },

    /* == Aliansi & Kerajaan (Keluarga) == */
    { id: 'ikatan-bersaudara',   cat: 'keluarga', rarity: 'biasa',    xp: 100,  icon: '🤝',
      title: 'Ikatan Bersaudara',
      desc: 'Menjaga hubungan keluarga dan sahabat dekat tetap erat meski sibuk.' },
    { id: 'aliansi-suci',        cat: 'keluarga', rarity: 'legendaris', xp: 800, icon: '💍',
      title: 'Aliansi Suci',
      desc: 'Menikah. Dua nama, satu panji.' },
    { id: 'pewaris-tahta',       cat: 'keluarga', rarity: 'legendaris', xp: 900, icon: '👶',
      title: 'Pewaris Tahta',
      desc: 'Memiliki anak. Kerajaan kecilmu resmi bertambah.' },
    { id: 'benteng-keluarga',    cat: 'keluarga', rarity: 'legendaris', xp: 1000, icon: '🏠',
      title: 'Benteng Keluarga',
      desc: 'Membeli rumah — benteng pertama yang berdiri atas namamu sendiri.' },

    /* == Penjelajahan (Petualangan) == */
    { id: 'langkah-pertama',     cat: 'petualangan', rarity: 'biasa', xp: 100, icon: '🧭',
      title: 'Langkah Pertama',
      desc: 'Petualangan pertama keluar dari gerbang kota raja.' },
    { id: 'puncak-dunia',        cat: 'petualangan', rarity: 'langka', xp: 300, icon: '⛰️',
      title: 'Puncak Dunia',
      desc: 'Mencapai puncak gunung tinggi dan menatap kerajaan dari atas.' },
    { id: 'lautan-asing',        cat: 'petualangan', rarity: 'langka', xp: 350, icon: '⛵',
      title: 'Lautan Asing',
      desc: 'Mendarat di negeri asing pertamamu di luar benua.' },
    { id: 'peta-tak-bertanda',   cat: 'petualangan', rarity: 'epik',  xp: 400, icon: '🗺️',
      title: 'Peta Tak Bertanda',
      desc: 'Perjalanan solo pertama, tanpa rombongan, hanya keberanian.' },
    { id: 'sang-kartografer',    cat: 'petualangan', rarity: 'epik',  xp: 500, icon: '🪶',
      title: 'Sang Kartografer',
      desc: 'Menjelajah 10 kota berbeda dan mencatat setiap kisahnya.' },
  ];
})(window.LIFEGOAL);
