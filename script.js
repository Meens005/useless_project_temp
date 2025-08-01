const notepad = document.getElementById('notepad');
const wordCountSpan = document.getElementById('wordCount');
const countdownSpan = document.getElementById('countdown');
const saveBtn = document.getElementById('saveBtn');
const modal = document.getElementById('saveModal');
const closeModal = document.getElementById('closeModal');

// Initialize audio with error handling
const vanishSound = new Audio('vanish.mp3');
vanishSound.volume = 0.5; // Adjust volume (0.0 to 1.0)

// Initialize maanchild audio
const maanchildSound = new Audio('manchildmain.mp3');
maanchildSound.volume = 0.7; // Slightly louder for dramatic effect

// Handle audio loading errors
vanishSound.addEventListener('error', () => {
    console.log('Could not load vanish.mp3 - sound effects disabled');
});

maanchildSound.addEventListener('error', () => {
    console.log('Could not load maanchild.mp3 - sound effects disabled');
});

// Preload the audio for better performance
vanishSound.preload = 'auto';
maanchildSound.preload = 'auto';

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

// Save button functionality
saveBtn.addEventListener('click', () => {
    // Play maanchild sound
    maanchildSound.currentTime = 0;
    maanchildSound.play().catch(error => {
        console.log('Maanchild audio play failed:', error);
    });
    
    // Show modal
    modal.style.display = 'block';
});

// Close modal functionality
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

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