#!/bin/bash
# Batch convert all PNG images to WebP format using cwebp
# Quality 85 = excellent visual quality with ~70-75% size reduction

QUALITY=85
TOTAL=0
CONVERTED=0
ORIGINAL_SIZE=0
NEW_SIZE=0

echo "🖼️  Starting PNG → WebP conversion (quality: $QUALITY)..."
echo "=================================================="

while IFS= read -r -d '' png_file; do
    TOTAL=$((TOTAL + 1))
    webp_file="${png_file%.png}.webp"
    
    # Get original size
    orig_size=$(stat -f%z "$png_file" 2>/dev/null || stat -c%s "$png_file" 2>/dev/null)
    ORIGINAL_SIZE=$((ORIGINAL_SIZE + orig_size))
    
    # Convert
    if cwebp -q $QUALITY "$png_file" -o "$webp_file" -quiet 2>/dev/null; then
        new_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
        NEW_SIZE=$((NEW_SIZE + new_size))
        CONVERTED=$((CONVERTED + 1))
        
        # Calculate reduction
        reduction=$(( (orig_size - new_size) * 100 / orig_size ))
        orig_mb=$(echo "scale=1; $orig_size / 1048576" | bc)
        new_mb=$(echo "scale=1; $new_size / 1048576" | bc)
        echo "  ✅ $(basename "$png_file"): ${orig_mb}MB → ${new_mb}MB (-${reduction}%)"
    else
        echo "  ❌ Failed: $png_file"
    fi
done < <(find images -name "*.png" -print0)

echo ""
echo "=================================================="
echo "📊 Summary:"
echo "   Files processed: $TOTAL"
echo "   Successfully converted: $CONVERTED"
orig_total_mb=$(echo "scale=1; $ORIGINAL_SIZE / 1048576" | bc)
new_total_mb=$(echo "scale=1; $NEW_SIZE / 1048576" | bc)
saved_mb=$(echo "scale=1; ($ORIGINAL_SIZE - $NEW_SIZE) / 1048576" | bc)
total_reduction=$(( (ORIGINAL_SIZE - NEW_SIZE) * 100 / ORIGINAL_SIZE ))
echo "   Original total: ${orig_total_mb}MB"
echo "   WebP total: ${new_total_mb}MB"
echo "   Saved: ${saved_mb}MB (-${total_reduction}%)"
echo "=================================================="
