<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="SIMANSUR - Sistem Informasi Manajemen Surat BPKAD Sub Bidang Aset Kota Pekanbaru">
    <meta name="author" content="BPKAD Kota Pekanbaru">
    <title>SIMANSUR - BPKAD Sub Bidang Aset Kota Pekanbaru</title>

    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])
</head>
<body class="bg-gov-bg text-gov-text font-sans antialiased min-h-screen">
    <div id="root"></div>
</body>
</html>
