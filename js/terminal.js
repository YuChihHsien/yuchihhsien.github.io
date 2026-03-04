function toggleTerminal() {
    const window = document.getElementById('terminalWindow');
    window.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    const terminalForm = document.getElementById('terminalForm');
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    let lastSendTime = 0;
    const COOLDOWN_MS = 5000;

    if (terminalForm) {
        terminalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cmd = terminalInput.value.trim();
            if (!cmd) return;

            // Simple "Command" logic
            const lowerCmd = cmd.toLowerCase();
            const isSystemCmd = ['help', 'clear', 'hi', 'hello', 'about'].includes(lowerCmd);

            if (!isSystemCmd) {
                const now = Date.now();
                const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastSendTime)) / 1000);
                if (timeLeft > 0) {
                    appendLine(`System: Uplink cooling down. Wait ${timeLeft}s...`, 'system');
                    return;
                }
            }

            // Display user command
            appendLine(`> ${cmd}`, 'user');
            terminalInput.value = '';

            // Simple "Command" logic


            if (lowerCmd === 'help') {
                appendLine('Available commands: help, clear, about, hi', 'system');
            } else if (lowerCmd === 'clear') {
                terminalBody.innerHTML = '';
                appendLine('--- GA-RY TERMINAL v1.0 ---', 'system');
            } else if (lowerCmd === 'hi' || lowerCmd === 'hello') {
                appendLine('System: Hello back! Type a message and I\'ll forward it to Gary.', 'system');
            } else if (lowerCmd === 'about') {
                appendLine('System: This is Gary\'s experimental tech Lab terminal.', 'system');
            } else {
                // Treat as a message and send via Web3Forms
                appendLine('System: Forwarding your transmission to source...', 'system');

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            access_key: 'a0e9f5ca-c926-4a8e-8a09-543c7e8eec2c',
                            name: 'Terminal User',
                            email: 'terminal@lab.io',
                            message: cmd,
                            subject: 'New Quick Transmission from Lab Terminal'
                        })
                    });

                    if (response.ok) {
                        appendLine('System: Transmission successful. Integrity confirmed.', 'system');
                        lastSendTime = Date.now();
                    } else {
                        appendLine('System Error: Packet loss detected.', 'system');
                    }
                } catch (err) {
                    appendLine('Fatal Error: Uplink unavailable.', 'system');
                }
            }

            // Auto-scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });
    }

    function appendLine(text, type) {
        const p = document.createElement('p');
        p.className = `terminal-msg ${type}`;
        p.innerText = text;
        terminalBody.appendChild(p);
    }
});
