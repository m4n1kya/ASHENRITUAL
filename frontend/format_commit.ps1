$files = Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx
$count = 0

foreach ($file in $files) {
    # Run prettier on the specific file
    npx prettier --write $file.FullName | Out-Null
    
    # Check if git recognizes a change
    $status = git status --porcelain $file.FullName
    if ($status) {
        git add $file.FullName
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
        $commitMessage = "Style: Format $relativePath with Prettier"
        git commit -m $commitMessage | Out-Null
        $count++
        Write-Host "Committed: $relativePath"
    }
}

Write-Host "Total frontend format commits: $count"
