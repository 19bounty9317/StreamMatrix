# PowerShell Script zum Loeschen alter GitHub Releases
# Behaelt nur die letzten 3 Releases: v1.4.8, v1.4.7, v1.4.6

Write-Host "Cleanup: Loesche alte GitHub Releases..." -ForegroundColor Cyan
Write-Host ""

# GitHub Repository Info
$owner = "19bounty9317"
$repo = "StreamMatrix"

# Releases die behalten werden sollen
$keepReleases = @("v1.4.8", "v1.4.7", "v1.4.6")

Write-Host "Behalte: $($keepReleases -join ', ')" -ForegroundColor Green
Write-Host ""

# Hole alle Releases
Write-Host "Lade alle Releases..." -ForegroundColor Yellow
$releases = gh release list --repo "$owner/$repo" --limit 100 | ForEach-Object {
    $parts = $_ -split '\t'
    [PSCustomObject]@{
        Tag = $parts[2]
        Title = $parts[0]
    }
}

Write-Host "Gefunden: $($releases.Count) Releases" -ForegroundColor Yellow
Write-Host ""

# Filtere Releases die gelöscht werden sollen
$toDelete = $releases | Where-Object { $_.Tag -notin $keepReleases }

if ($toDelete.Count -eq 0) {
    Write-Host "Keine alten Releases zum Loeschen gefunden!" -ForegroundColor Green
    exit 0
}

Write-Host "Folgende Releases werden geloescht:" -ForegroundColor Red
$toDelete | ForEach-Object {
    Write-Host "  - $($_.Tag): $($_.Title)" -ForegroundColor Red
}
Write-Host ""

# Bestaetigung
$confirm = Read-Host "Moechtest du diese Releases wirklich loeschen? (ja/nein)"

if ($confirm -ne "ja") {
    Write-Host "Abgebrochen." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Loesche Releases..." -ForegroundColor Cyan

# Loesche jedes Release
foreach ($release in $toDelete) {
    Write-Host "Loesche $($release.Tag)..." -ForegroundColor Yellow
    
    try {
        gh release delete $release.Tag --repo "$owner/$repo" --yes
        Write-Host "$($release.Tag) geloescht" -ForegroundColor Green
    }
    catch {
        Write-Host "Fehler beim Loeschen von $($release.Tag): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cleanup abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "Verbleibende Releases:" -ForegroundColor Cyan
gh release list --repo "$owner/$repo" --limit 10
