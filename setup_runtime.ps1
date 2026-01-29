param(
    [string]$DownloadUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip",
    [string]$TargetDir = "node_runtime"
)

$ZipFile = "$TargetDir\node.zip"

# Create target directory
if (!(Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

# Check if node.exe already exists
if (Test-Path -Path "$TargetDir\node-v20.11.0-win-x64\node.exe") {
    Write-Host "[INFO] Node.js runtime already exists."
    exit 0
}

Write-Host "[INFO] Downloading Node.js runtime..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipFile -UseBasicParsing
}
catch {
    Write-Host "[ERROR] Download failed: $_"
    exit 1
}

Write-Host "[INFO] Extracting Node.js runtime..."
try {
    Expand-Archive -Path $ZipFile -DestinationPath $TargetDir -Force
    Remove-Item -Path $ZipFile -Force
}
catch {
    Write-Host "[ERROR] Extraction failed: $_"
    exit 1
}

Write-Host "[SUCCESS] Node.js runtime installed successfully."
exit 0
