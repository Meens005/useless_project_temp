const notepad = document.getElementById('notepad');
const wordCountSpan = document.getElementById('wordCount');
const countdownSpan = document.getElementById('countdown');

// Initialize audio with error handling
const vanishSound = new Audio('vanish.mp3');
vanishSound.volume = 0.5; // Adjust volume (0.0 to 1.0)

// Handle audio loading errors
vanishSound.addEventListener('error', () => {
    console.log('Could not load vanish.mp4 - sound effects disabled');
});

// Preload the audio for better performance
vanishSound.preload = 'auto';

function updateWordCount() {
    const text = notepad.value.trim();
    const words = text === '' ? [] : text.split(/\s+/);
    const wordCount = words.length;
    
    // Calculate countdown to next reset
    const wordsUntilReset = wordCount === 0 ? 5 : 5 - ((wordCount - 1) % 5);
    
    // Update display
    wordCountSpan.textContent = wordCount;
    countdownSpan.textContent = wordsUntilReset;
    
    // Add warning when close to reset
    if (wordsUntilReset <= 2 && wordCount > 0) {
        countdownSpan.className = 'warning';
    } else {
        countdownSpan.className = '';
    }
    
    // Check if we need to clear (every 6th word)
    if (wordCount > 0 && wordCount % 5 === 1 && wordCount > 1) {
        const lastWord = words[words.length - 1];
        
        // 🔊 Play vanish sound
        vanishSound.currentTime = 0;
        vanishSound.play().catch(error => {
            console.log('Audio play failed:', error);
        });
        
        // ✨ Gradually clear words during the 4-second audio
        const wordsToRemove = words.slice(0, -1); // All words except the last one
        let currentText = notepad.value;
        
        // Remove words one by one over 4 seconds
        wordsToRemove.forEach((word, index) => {
            setTimeout(() => {
                // Remove the first word from current text
                const currentWords = currentText.trim().split(/\s+/);
                if (currentWords.length > 1) {
                    currentWords.shift(); // Remove first word
                    currentText = currentWords.join(' ');
                    notepad.value = currentText;
                    
                    // Keep cursor at end
                    notepad.setSelectionRange(notepad.value.length, notepad.value.length);
                }
            }, (index + 1) * (4000 / wordsToRemove.length)); // Spread over 4 seconds
        });
        
        // Ensure only the 6th word remains after 4 seconds
        setTimeout(() => {
            notepad.value = lastWord;
            notepad.setSelectionRange(notepad.value.length, notepad.value.length);
        }, 4000);
    }
}

// Listen for typing
notepad.addEventListener('input', updateWordCount);

// Also check on space/enter key
notepad.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        updateWordCount();
    }
});

// Initial update
updateWordCount();
