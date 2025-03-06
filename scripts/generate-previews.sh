#!/bin/bash

# Create the previews directory if it doesn't exist
mkdir -p public/videos/previews

# Function to sanitize filenames
sanitize_filename() {
    # First replace special characters with hyphens, then clean up multiple hyphens
    # Use a more compatible regex pattern
    echo "$1" | tr ' ' '-' | sed 's/│/-/g' | sed 's/[^a-zA-Z0-9_.-]/-/g' | sed 's/--*/-/g'
}

# Process each video in the all directory
for video in public/videos/all/*.mp4; do
    # Get the filename without path and extension
    filename=$(basename "$video")
    base="${filename%.*}"
    
    # Sanitize the output filename
    sanitized_base=$(sanitize_filename "$base")
    
    # Debug output to see what's happening
    echo "Original filename: $filename"
    echo "Base name: $base"
    echo "Sanitized name: $sanitized_base"
    
    preview_path="public/videos/previews/${sanitized_base}-preview.mp4"
    
    echo "Processing $filename..."
    echo "Creating preview at: $preview_path"
    
    # Generate preview video:
    # - Extract first 15 seconds
    # - Scale to 640p width while maintaining aspect ratio
    # - Remove audio
    # - Use H.264 codec with CRF 28 for good compression
    # - Use fast preset for quicker encoding
    ffmpeg -y -i "$video" \
        -t 15 \
        -vf "scale=640:-2" \
        -an \
        -c:v libx264 \
        -crf 28 \
        -preset fast \
        -movflags +faststart \
        "$preview_path"
        
    if [ $? -eq 0 ]; then
        echo "Created preview: $preview_path"
    else
        echo "Error creating preview for $filename"
    fi
done

echo "All previews generated successfully!" 