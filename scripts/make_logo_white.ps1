param(
  [string]$InputPath,
  [string]$OutputPath
)

if (-not $InputPath -or -not (Test-Path $InputPath)) {
  if (Test-Path "assets/@logo_white.png") {
    $InputPath = "assets/@logo_white.png"
  } elseif (Test-Path "assets/logo_transparent.png") {
    $InputPath = "assets/logo_transparent.png"
  } elseif (Test-Path "@logo_transparent.png") {
    $InputPath = "@logo_transparent.png"
  } elseif (Test-Path "logo_transparent.png") {
    $InputPath = "logo_transparent.png"
  } else {
    Write-Error "Input logo not found. Expected '@logo_transparent.png' or 'logo_transparent.png' in repo root."
    exit 1
  }
}

if (-not $OutputPath) {
  $OutputPath = "assets/@logo_white.png"
}

Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile($InputPath)
try {
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $c = $bmp.GetPixel($x, $y)
      if ($c.A -gt 0) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
      }
    }
  }
  $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "Wrote $OutputPath"
}
finally {
  $bmp.Dispose()
}
