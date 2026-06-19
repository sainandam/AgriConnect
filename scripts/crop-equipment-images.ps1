Add-Type -AssemblyName System.Drawing

$src = 'C:\Users\avvar\.cursor\projects\c-Kickkuu-CSP-CSP\assets\c__Users_avvar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-07_at_11.29.49_AM-c2a4d065-2c4a-49fb-b223-e762e603dbb3.png'
$outDir = Join-Path $PSScriptRoot '..\public\equipment'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height
Write-Host "Source image: ${w}x${h}"

# Grid layout: 2 rows x 5 columns of equipment cards
# Header ~14%, footer ~22%, grid area in between
$gridTop = [int]($h * 0.145)
$gridBottom = [int]($h * 0.78)
$gridLeft = [int]($w * 0.03)
$gridRight = [int]($w * 0.97)
$gridW = $gridRight - $gridLeft
$gridH = $gridBottom - $gridTop

$colW = [int]($gridW / 5)
$rowH = [int]($gridH / 2)

# Crop only the photo area inside each card (~55% of card height, below title text)
$photoTopOffset = [int]($rowH * 0.28)
$photoHeight = [int]($rowH * 0.52)
$photoSidePad = [int]($colW * 0.08)
$photoWidth = $colW - (2 * $photoSidePad)

$names = @(
    'tractor',
    'tractor-trailer',
    'rotavator',
    'cultivator',
    'seed-drill',
    'power-sprayer',
    'power-tiller',
    'paddy-transplanter',
    'combine-harvester',
    'thresher'
)

$index = 0
for ($row = 0; $row -lt 2; $row++) {
    for ($col = 0; $col -lt 5; $col++) {
        $x = $gridLeft + ($col * $colW) + $photoSidePad
        $y = $gridTop + ($row * $rowH) + $photoTopOffset
        $rect = New-Object System.Drawing.Rectangle $x, $y, $photoWidth, $photoHeight

        $bmp = New-Object System.Drawing.Bitmap $photoWidth, $photoHeight
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()

        $outPath = Join-Path $outDir ($names[$index] + '.png')
        $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Saved $outPath"
        $index++
    }
}

$img.Dispose()
Write-Host 'Done cropping 10 equipment images.'
