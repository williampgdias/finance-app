#!/bin/bash
set -e

# 1. Correção do Apache (A parte do tutorial que você já tem)
echo "Fixing Apache Modules..."
a2dismod mpm_event 2>/dev/null || true
a2dismod mpm_worker 2>/dev/null || true
a2dismod mpm_prefork 2>/dev/null || true
a2enmod mpm_prefork

# 2. 👇 A PARTE QUE FALTA: Criar as tabelas no Banco de Dados 👇
echo "Running Database Migrations..."
php artisan migrate:fresh --seed --force

# 3. Otimização de Cache (Para ficar rápido)
echo "Caching Configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Inicia o Apache
echo "Starting Apache..."
exec apache2-foreground
