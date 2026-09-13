
        // Configuration
        const START_YEAR = 1951;
        const TOTAL_YEARS = 76;
        
        // DOM Elements
        const gridContainer = document.getElementById('grid-container');
        const progressBar = document.getElementById('progress-bar');
        const ageCounter = document.getElementById('age-counter');
        const resetBtn = document.getElementById('reset-btn');
        const modal = document.getElementById('celebration-modal');

        // State
        let completedGames = JSON.parse(localStorage.getItem('jubilee_progress')) || [];

        const GAME_TITLES = {
            1951: "De Eerste Uitzending",
            1952: "Donald Duck",
            1953: "De Watersnoodramp",
            1954: "Betaald Voetbal",
            1955: "Nijntje",
            1956: "NTS Televisie",
            1957: "Invoering AOW",
            1958: "Deltawerken",
            1959: "Slochteren",
            1960: "Vrije Zaterdag",
            1961: "Berlijnse Muur",
            1962: "Nieuw-Guinea",
            1963: "De Hel van '63",
            1964: "The Beatles in Blokker",
            1965: "Witte Fietsenplan"
        };

        // Generate ambient balloons in the background
        function createAmbientBalloons() {
            const emojis = ['🎈', '🎊', '🎉', '✨', '🥂'];
            for(let i = 0; i < 15; i++) {
                const b = document.createElement('div');
                b.className = 'balloon';
                b.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                b.style.left = Math.random() * 100 + 'vw';
                b.style.animationDuration = (Math.random() * 15 + 15) + 's';
                b.style.animationDelay = (Math.random() * 10) + 's';
                b.style.fontSize = (Math.random() * 2 + 2) + 'rem';
                document.body.appendChild(b);
            }
        }

        // Initialize the Grid
        function initGrid() {
            gridContainer.innerHTML = '';
            for (let i = 0; i < TOTAL_YEARS; i++) {
                const year = START_YEAR + i;
                const isCompleted = completedGames.includes(year);
                
                const card = document.createElement('div');
                card.className = `card ${isCompleted ? 'completed' : ''}`;
                card.id = `card-${year}`;
                
                card.innerHTML = `
                    <div>
                        <h2 class="year-label">${year}</h2>
                        <p class="game-title">${GAME_TITLES[year] || "Spel " + (i + 1)}</p>
                    </div>
                    <button class="play-btn" onclick="playGame(${year})">Speel</button>
                    <div class="completed-mark">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Voltooid
                    </div>
                `;
                
                gridContainer.appendChild(card);
            }
            updateDashboard(false);
        }

        function closeGameOverlay(year) {
            const overlay = document.getElementById(`game-overlay-${year}`);
            if (overlay) overlay.classList.remove('active');
            
            if (year === 1952) { clearInterval(spawnLoop1952); cancelAnimationFrame(gameLoop1952); }
            if (year === 1953) { isPlaying1953 = false; clearInterval(timerInterval1953); clearInterval(leakSpawner1953); }
            if (year === 1954) { isPlaying1954 = false; cancelAnimationFrame(penaltyLoop1954); }
            if (year === 1956) { isPlaying1956 = false; cancelAnimationFrame(loop1956); }
            if (year === 1957) { isPlaying1957 = false; cancelAnimationFrame(loop1957); }
            if (year === 1958) { isPlaying1958 = false; cancelAnimationFrame(craneLoop1958); }
            if (year === 1959) { isPlaying1959 = false; }
            if (year === 1960) { isPlaying1960 = false; clearTimeout(spawnTimeout1960); }
            if (year === 1961) { isPlaying1961 = false; cancelAnimationFrame(loop1961); }
            if (year === 1962) { 
                isPlaying1962 = false; 
                window.removeEventListener('mouseup', stopDragging1962); 
                const mg = document.getElementById('map-grid-1962'); 
                if(mg) mg.removeEventListener('touchmove', handleTouchMove1962); 
            }
            if (year === 1963) { isPlaying1963 = false; cancelAnimationFrame(loop1963); }
            if (year === 1964) { isPlaying1964 = false; cancelAnimationFrame(loop1964); document.removeEventListener('keydown', handleSpacebar1964); }
            if (year === 1965) { isPlaying1965 = false; cancelAnimationFrame(loop1965); document.removeEventListener('keydown', handleKeyDown1965); document.removeEventListener('keyup', handleKeyUp1965); }
        }

        // Handle Play button click router
        function playGame(year) {
            if (year === 1951) {
                startMinigame1951();
            } else if (year === 1952) {
                startMinigame1952();
            } else if (year === 1953) {
                startMinigame1953();
            } else if (year === 1954) {
                startMinigame1954();
            } else if (year === 1955) {
                startMinigame1955();
            } else if (year === 1956) {
                startMinigame1956();
            } else if (year === 1957) {
                startMinigame1957();
            } else if (year === 1958) {
                startMinigame1958();
            } else if (year === 1959) {
                startMinigame1959();
            } else if (year === 1960) {
                startMinigame1960();
            } else if (year === 1961) {
                startMinigame1961();
            } else if (year === 1962) {
                startMinigame1962();
            } else if (year === 1963) {
                startMinigame1963();
            } else if (year === 1964) {
                startMinigame1964();
            } else if (year === 1965) {
                startMinigame1965();
            } else {
                // Mock interaction for future games
                if (!completedGames.includes(year)) {
                    completeGame(year);
                }
            }
        }

        // Universal Game Completion Logic
        function completeGame(year) {
            if (!completedGames.includes(year)) {
                completedGames.push(year);
                localStorage.setItem('jubilee_progress', JSON.stringify(completedGames));
                
                // Update specific card visually
                const card = document.getElementById(`card-${year}`);
                if (card) {
                    card.classList.add('completed');
                    // Add a tiny local confetti pop on the card
                    confetti({
                        particleCount: 30,
                        spread: 50,
                        origin: {
                            y: (card.getBoundingClientRect().top + (card.clientHeight / 2)) / window.innerHeight,
                            x: (card.getBoundingClientRect().left + (card.clientWidth / 2)) / window.innerWidth
                        },
                        colors: ['#FFD700', '#D4AF37', '#E63946']
                    });
                }
                
                updateDashboard(true);
            }
        }

        // ==========================================
        // 1951 MINIGAME LOGIC
        // ==========================================
        const TOTAL_CABLES_1951 = 75;
        let connectedCables1951 = 0;
        
        const overlay1951 = document.getElementById('game-overlay-1951');
        const gameContent1951 = document.getElementById('game-content-1951');
        const cableGrid1951 = document.getElementById('cable-grid-1951');
        const cableCounter1951 = document.getElementById('cable-count-1951');
        const testPatternBg = document.getElementById('bg-test-pattern');
        const winModal1951 = document.getElementById('win-modal-1951');

        function startMinigame1951() {
            // Reset state
            connectedCables1951 = 0;
            cableCounter1951.innerText = connectedCables1951;
            
            testPatternBg.classList.remove('active');
            winModal1951.classList.remove('active');
            gameContent1951.style.opacity = '1';
            gameContent1951.style.pointerEvents = 'all';
            
            cableGrid1951.innerHTML = ''; // Clear previous
            
            // Generate 75 plugs
            for(let i=0; i<TOTAL_CABLES_1951; i++) {
                const plug = document.createElement('div');
                plug.className = 'plug';
                plug.onclick = function() {
                    if(!this.classList.contains('connected')) {
                        this.classList.add('connected');
                        connectedCables1951++;
                        cableCounter1951.innerText = connectedCables1951;
                        
                        // Check Win Condition
                        if(connectedCables1951 === TOTAL_CABLES_1951) {
                            winMinigame1951();
                        }
                    }
                };
                cableGrid1951.appendChild(plug);
            }
            
            // Show Overlay
            overlay1951.classList.add('active');
        }

        function winMinigame1951() {
            // Hide the grid content, show test pattern
            gameContent1951.style.opacity = '0';
            gameContent1951.style.pointerEvents = 'none';
            testPatternBg.classList.add('active');
            
            // Wait slightly for the test pattern to fade in, then show modal
            setTimeout(() => {
                winModal1951.classList.add('active');
                
                // Add some thematic confetti
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#FFFFFF', '#FFFF00', '#00FFFF', '#00FF00', '#FF00FF', '#FF0000', '#0000FF']
                });
            }, 800);
        }

        function finishMinigame1951() {
            // Close the overlay
            overlay1951.classList.remove('active');
            
            // Trigger the general completion flow after transition
            setTimeout(() => {
                completeGame(1951);
            }, 400);
        }
        // ==========================================

        // ==========================================
        // 1952 MINIGAME LOGIC
        // ==========================================
        const TOTAL_DUCKS_1952 = 75;
        let caughtDucks1952 = 0;
        let gameLoop1952;
        let spawnLoop1952;
        let magazines1952 = [];
        
        const overlay1952 = document.getElementById('game-overlay-1952');
        const area1952 = document.getElementById('game-area-1952');
        const mailbox1952 = document.getElementById('mailbox-1952');
        const scoreUI1952 = document.getElementById('score-1952');
        const winModal1952 = document.getElementById('win-modal-1952');

        // Mouse/Touch movement logic
        function moveMailbox1952(e) {
            const rect = area1952.getBoundingClientRect();
            let clientX;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
            } else if (e.clientX !== undefined) {
                clientX = e.clientX;
            } else {
                return;
            }
            
            let x = clientX - rect.left;
            const mailboxWidth = 90;
            // Constrain within game area
            if (x < mailboxWidth / 2) x = mailboxWidth / 2;
            if (x > rect.width - mailboxWidth / 2) x = rect.width - mailboxWidth / 2;
            
            mailbox1952.style.left = x + 'px';
        }

        area1952.addEventListener('mousemove', moveMailbox1952);
        area1952.addEventListener('touchmove', (e) => { 
            e.preventDefault(); // Prevent scrolling
            moveMailbox1952(e); 
        }, {passive: false});

        function spawnMagazine1952() {
            if (caughtDucks1952 >= TOTAL_DUCKS_1952) return;
            
            const mag = document.createElement('div');
            mag.className = 'magazine-1952';
            mag.innerText = Math.random() > 0.5 ? '📰' : '🦆';
            
            const rect = area1952.getBoundingClientRect();
            const startX = Math.random() * (rect.width - 60) + 30; // Keep slightly off edges
            mag.style.left = startX + 'px';
            mag.style.top = '-50px';
            
            area1952.appendChild(mag);
            magazines1952.push({
                el: mag,
                y: -50,
                x: startX,
                speed: 3 + Math.random() * 4, // Falls down
                wobble: Math.random() * Math.PI * 2
            });
        }

        function updateGameLoop1952() {
            if (caughtDucks1952 >= TOTAL_DUCKS_1952) return;
            
            const areaRect = area1952.getBoundingClientRect();
            // Get mailbox center X
            let mbX = areaRect.width / 2; 
            if(mailbox1952.style.left) {
                mbX = parseFloat(mailbox1952.style.left);
            }
            
            const mailboxTop = areaRect.height - 120; // mailbox height 120 + bottom 20

            for(let i = magazines1952.length - 1; i >= 0; i--) {
                let m = magazines1952[i];
                m.y += m.speed;
                m.wobble += 0.05; // horizontal drift speed
                
                // Add horizontal wobble for realistic falling leaf effect
                let currentX = m.x + Math.sin(m.wobble) * 30;
                
                m.el.style.top = m.y + 'px';
                m.el.style.left = currentX + 'px';
                
                let magBottom = m.y + 40; // Approx emoji height
                
                // Collision
                if (magBottom >= mailboxTop && m.y < areaRect.height - 20) {
                    if (Math.abs(currentX - mbX) < 65) {
                        // Caught!
                        m.el.remove();
                        magazines1952.splice(i, 1);
                        caughtDucks1952++;
                        scoreUI1952.innerText = `Donald Ducks gevangen: ${caughtDucks1952} / ${TOTAL_DUCKS_1952}`;
                        
                        // Bounce effect on mailbox
                        mailbox1952.style.transform = 'translateX(-50%) scale(1.15)';
                        setTimeout(() => mailbox1952.style.transform = 'translateX(-50%) scale(1)', 100);
                        
                        if (caughtDucks1952 >= TOTAL_DUCKS_1952) {
                            winMinigame1952();
                        }
                        continue;
                    }
                }
                
                // Missed, goes out of screen
                if (m.y > areaRect.height) {
                    m.el.remove();
                    magazines1952.splice(i, 1);
                }
            }
            
            gameLoop1952 = requestAnimationFrame(updateGameLoop1952);
        }

        function startMinigame1952() {
            // Reset
            caughtDucks1952 = 0;
            scoreUI1952.innerText = `Donald Ducks gevangen: 0 / ${TOTAL_DUCKS_1952}`;
            winModal1952.classList.remove('active');
            mailbox1952.style.left = '50%';
            
            // Clean up old magazines
            magazines1952.forEach(m => m.el.remove());
            magazines1952 = [];
            
            overlay1952.classList.add('active');
            
            // Start loops
            spawnLoop1952 = setInterval(spawnMagazine1952, 350); // Speed of spawning
            gameLoop1952 = requestAnimationFrame(updateGameLoop1952);
        }

        function winMinigame1952() {
            clearInterval(spawnLoop1952);
            cancelAnimationFrame(gameLoop1952);
            
            setTimeout(() => {
                winModal1952.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#E63946', '#FFD700', '#FFFFFF']
                });
            }, 500);
        }

        function finishMinigame1952() {
            overlay1952.classList.remove('active');
            setTimeout(() => {
                completeGame(1952);
            }, 400);
        }
        // ==========================================


        // ==========================================
        // 1953 MINIGAME LOGIC
        // ==========================================
        const TOTAL_BAGS_1953 = 75;
        const TIME_LIMIT_1953 = 75;
        let bagsPlaced1953 = 0;
        let timeLeft1953 = TIME_LIMIT_1953;
        let isPlaying1953 = false;
        let timerInterval1953;
        let leakSpawner1953;
        
        const overlay1953 = document.getElementById('game-overlay-1953');
        const area1953 = document.getElementById('game-area-1953');
        const grid1953 = document.getElementById('dike-grid-1953');
        const scoreUI1953 = document.getElementById('score-1953');
        const timerUI1953 = document.getElementById('timer-1953');
        const winModal1953 = document.getElementById('win-modal-1953');
        const loseModal1953 = document.getElementById('lose-modal-1953');

        function startMinigame1953() {
            bagsPlaced1953 = 0;
            timeLeft1953 = TIME_LIMIT_1953;
            isPlaying1953 = true;
            
            scoreUI1953.innerText = `Zandzakken geplaatst: 0 / ${TOTAL_BAGS_1953}`;
            timerUI1953.innerText = `Tijd: ${timeLeft1953}s`;
            timerUI1953.classList.remove('danger');
            
            winModal1953.classList.remove('active');
            loseModal1953.classList.remove('active');
            area1953.style.opacity = '1';
            
            grid1953.innerHTML = '';
            for(let i = 0; i < 20; i++) {
                const hole = document.createElement('div');
                hole.className = 'dike-hole';
                hole.onclick = () => handleHoleClick1953(hole);
                grid1953.appendChild(hole);
            }
            
            overlay1953.classList.add('active');
            
            clearInterval(timerInterval1953);
            clearInterval(leakSpawner1953);
            
            timerInterval1953 = setInterval(() => {
                if(!isPlaying1953) return;
                timeLeft1953--;
                timerUI1953.innerText = `Tijd: ${timeLeft1953}s`;
                if(timeLeft1953 <= 10) timerUI1953.classList.add('danger');
                
                if(timeLeft1953 <= 0) loseMinigame1953();
            }, 1000);
            
            leakSpawner1953 = setInterval(() => {
                if(!isPlaying1953) return;
                spawnLeak1953();
            }, 450); // fast spawn
        }

        function spawnLeak1953() {
            const holes = Array.from(grid1953.children).filter(h => !h.classList.contains('leak') && !h.classList.contains('sandbag'));
            if(holes.length === 0) return;
            
            const hole = holes[Math.floor(Math.random() * holes.length)];
            hole.classList.add('leak');
            
            // Revert if not clicked
            setTimeout(() => {
                if(hole.classList.contains('leak')) {
                    hole.classList.remove('leak');
                }
            }, 1200 + Math.random() * 800);
        }

        function handleHoleClick1953(hole) {
            if(!isPlaying1953) return;
            
            if(hole.classList.contains('leak')) {
                hole.classList.remove('leak');
                hole.classList.add('sandbag');
                
                bagsPlaced1953++;
                scoreUI1953.innerText = `Zandzakken geplaatst: ${bagsPlaced1953} / ${TOTAL_BAGS_1953}`;
                
                if(bagsPlaced1953 >= TOTAL_BAGS_1953) {
                    winMinigame1953();
                } else {
                    setTimeout(() => {
                        hole.classList.remove('sandbag');
                    }, 800);
                }
            }
        }

        function winMinigame1953() {
            isPlaying1953 = false;
            clearInterval(timerInterval1953);
            clearInterval(leakSpawner1953);
            
            area1953.style.opacity = '0';
            setTimeout(() => winModal1953.classList.add('active'), 500);
        }

        function loseMinigame1953() {
            isPlaying1953 = false;
            clearInterval(timerInterval1953);
            clearInterval(leakSpawner1953);
            
            area1953.style.opacity = '0';
            setTimeout(() => loseModal1953.classList.add('active'), 500);
        }

        function finishMinigame1953() {
            overlay1953.classList.remove('active');
            setTimeout(() => completeGame(1953), 400);
        }
        // ==========================================

        // ==========================================
        // 1954 MINIGAME LOGIC
        // ==========================================
        const TOTAL_GOALS_1954 = 75;
        let goalsScored1954 = 0;
        let isPlaying1954 = false;
        let penaltyLoop1954;
        let indicatorX1954 = 0;
        let indicatorDir1954 = 1;
        
        const overlay1954 = document.getElementById('game-overlay-1954');
        const scoreUI1954 = document.getElementById('score-1954');
        const indicator1954 = document.getElementById('indicator-1954');
        const winModal1954 = document.getElementById('win-modal-1954');
        const field1954 = document.getElementById('football-field-1954');

        function startMinigame1954() {
            goalsScored1954 = 0;
            scoreUI1954.innerText = `Doelpunten: 0 / ${TOTAL_GOALS_1954}`;
            winModal1954.classList.remove('active');
            overlay1954.classList.add('active');
            
            isPlaying1954 = true;
            indicatorX1954 = 0;
            indicatorDir1954 = 1;
            
            cancelAnimationFrame(penaltyLoop1954);
            penaltyLoop1954 = requestAnimationFrame(updatePenaltyLoop1954);
        }

        function updatePenaltyLoop1954() {
            if(!isPlaying1954) return;
            
            // Speed increases slightly as score goes up
            const speed = 1.2 + (goalsScored1954 * 0.04); 
            indicatorX1954 += speed * indicatorDir1954;
            
            if(indicatorX1954 >= 100) { indicatorX1954 = 100; indicatorDir1954 = -1; }
            if(indicatorX1954 <= 0) { indicatorX1954 = 0; indicatorDir1954 = 1; }
            
            indicator1954.style.left = indicatorX1954 + '%';
            
            penaltyLoop1954 = requestAnimationFrame(updatePenaltyLoop1954);
        }

        function shootPenalty1954() {
            if(!isPlaying1954) return;
            
            // Sweet spot is between 40% and 60%
            if(indicatorX1954 >= 40 && indicatorX1954 <= 60) {
                // Success
                goalsScored1954++;
                scoreUI1954.innerText = `Doelpunten: ${goalsScored1954} / ${TOTAL_GOALS_1954}`;
                
                field1954.classList.remove('flash-success');
                void field1954.offsetWidth; // trigger reflow
                field1954.classList.add('flash-success');
                
                if(goalsScored1954 >= TOTAL_GOALS_1954) {
                    winMinigame1954();
                }
            } else {
                // Fail
                field1954.classList.remove('flash-fail');
                void field1954.offsetWidth;
                field1954.classList.add('flash-fail');
            }
        }

        function winMinigame1954() {
            isPlaying1954 = false;
            cancelAnimationFrame(penaltyLoop1954);
            
            setTimeout(() => {
                winModal1954.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#4CAF50', '#FFFFFF', '#FFD700']
                });
            }, 300);
        }

        function finishMinigame1954() {
            overlay1954.classList.remove('active');
            setTimeout(() => completeGame(1954), 400);
        }
        // ==========================================

        // ==========================================
        // 1955 MINIGAME LOGIC
        // ==========================================
        const TOTAL_CELLS_1955 = 75;
        let coloredCells1955 = 0;
        let activeColor1955 = '#E1261C'; // Default to red
        
        const overlay1955 = document.getElementById('game-overlay-1955');
        const grid1955 = document.getElementById('coloring-grid-1955');
        const scoreUI1955 = document.getElementById('score-1955');
        const winModal1955 = document.getElementById('win-modal-1955');

        function selectColor1955(color, btnElem) {
            activeColor1955 = color;
            document.querySelectorAll('.color-btn-1955').forEach(btn => btn.classList.remove('active'));
            btnElem.classList.add('active');
        }

        function startMinigame1955() {
            coloredCells1955 = 0;
            scoreUI1955.innerText = `Vlakjes ingekleurd: 0 / ${TOTAL_CELLS_1955}`;
            winModal1955.classList.remove('active');
            
            const miffyMap = [
                0, 1, 1, 1, 0, 1, 1, 1, 0,
                0, 1, 1, 1, 0, 1, 1, 1, 0,
                1, 1, 1, 1, 0, 1, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 0, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 0, 1, 0, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1,
                1, 1, 1, 0, 1, 0, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1
            ];

            // Generate grid
            grid1955.innerHTML = '';
            for(let i = 0; i < miffyMap.length; i++) {
                const cell = document.createElement('div');
                cell.className = 'coloring-cell-1955';
                if (miffyMap[i] === 0) {
                    cell.classList.add('black-cell');
                } else {
                    cell.dataset.colored = "false";
                    cell.onclick = () => colorCell1955(cell);
                }
                grid1955.appendChild(cell);
            }
            
            overlay1955.classList.add('active');
        }

        function colorCell1955(cell) {
            if (cell.dataset.colored === "false") {
                cell.style.background = activeColor1955;
                cell.dataset.colored = "true";
                coloredCells1955++;
                scoreUI1955.innerText = `Vlakjes ingekleurd: ${coloredCells1955} / ${TOTAL_CELLS_1955}`;
                
                // Add slight bounce
                cell.style.transform = "scale(0.8)";
                setTimeout(() => cell.style.transform = "scale(1)", 100);
                
                if (coloredCells1955 >= TOTAL_CELLS_1955) {
                    winMinigame1955();
                }
            } else {
                // If already colored, allow changing color but don't increment counter
                cell.style.background = activeColor1955;
            }
        }

        function winMinigame1955() {
            setTimeout(() => {
                winModal1955.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#E1261C', '#F3CA00', '#0057A4', '#00893A'] // Bruna colors
                });
            }, 300);
        }

        function finishMinigame1955() {
            overlay1955.classList.remove('active');
            setTimeout(() => completeGame(1955), 400);
        }
        // ==========================================

        // ==========================================
        // 1956 MINIGAME LOGIC
        // ==========================================
        const TOTAL_SIGNAL_1956 = 75;
        let signal1956 = 0;
        let isPlaying1956 = false;
        let sweetSpot1956 = 50;
        let sweetSpotDir1956 = 1;
        let loop1956;
        
        const overlay1956 = document.getElementById('game-overlay-1956');
        const slider1956 = document.getElementById('tv-slider-1956');
        const staticNoise1956 = document.getElementById('tv-static-1956');
        const scoreUI1956 = document.getElementById('score-1956');
        const winModal1956 = document.getElementById('win-modal-1956');

        function startMinigame1956() {
            signal1956 = 0;
            sweetSpot1956 = Math.random() * 60 + 20; // 20 to 80
            sweetSpotDir1956 = Math.random() > 0.5 ? 1 : -1;
            slider1956.value = 50;
            isPlaying1956 = true;
            
            scoreUI1956.innerText = `Signaalsterkte: 0 / ${TOTAL_SIGNAL_1956}`;
            winModal1956.classList.remove('active');
            staticNoise1956.style.opacity = 1;
            
            overlay1956.classList.add('active');
            
            cancelAnimationFrame(loop1956);
            loop1956 = requestAnimationFrame(updateLoop1956);
        }

        function updateLoop1956() {
            if(!isPlaying1956) return;
            
            // Move sweet spot slowly
            sweetSpot1956 += 0.25 * sweetSpotDir1956;
            if(sweetSpot1956 > 85) { sweetSpot1956 = 85; sweetSpotDir1956 = -1; }
            if(sweetSpot1956 < 15) { sweetSpot1956 = 15; sweetSpotDir1956 = 1; }
            
            const playerVal = parseInt(slider1956.value);
            const dist = Math.abs(playerVal - sweetSpot1956);
            
            // Map distance to opacity (max 1, min 0.1 so you always see some static until win)
            let targetOpacity = dist / 20; 
            if (targetOpacity > 1) targetOpacity = 1;
            if (targetOpacity < 0.15) targetOpacity = 0.15; 
            
            staticNoise1956.style.opacity = targetOpacity;
            
            // Increase signal if dist < 12
            if(dist < 12) {
                signal1956 += 0.2; // roughly ~12 per second at 60fps
                scoreUI1956.innerText = `Signaalsterkte: ${Math.floor(signal1956)} / ${TOTAL_SIGNAL_1956}`;
                
                if(signal1956 >= TOTAL_SIGNAL_1956) {
                    winMinigame1956();
                }
            }
            
            if (isPlaying1956) {
                loop1956 = requestAnimationFrame(updateLoop1956);
            }
        }

        function winMinigame1956() {
            isPlaying1956 = false;
            cancelAnimationFrame(loop1956);
            
            staticNoise1956.style.opacity = 0; // completely clear image!
            scoreUI1956.innerText = `Signaalsterkte: ${TOTAL_SIGNAL_1956} / ${TOTAL_SIGNAL_1956}`;
            
            setTimeout(() => {
                winModal1956.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#FFFFFF', '#D4AF37', '#000000']
                });
            }, 800);
        }

        function finishMinigame1956() {
            overlay1956.classList.remove('active');
            setTimeout(() => completeGame(1956), 400);
        }
        // ==========================================

        // ==========================================
        // 1957 MINIGAME LOGIC
        // ==========================================
        const TOTAL_COINS_1957 = 75;
        let score1957 = 0;
        let isPlaying1957 = false;
        let loop1957;
        let spawnTimer1957 = 0;
        let coins1957 = [];
        let piggyX = window.innerWidth / 2;
        
        const overlay1957 = document.getElementById('game-overlay-1957');
        const area1957 = document.getElementById('game-area-1957');
        const piggy1957 = document.getElementById('piggy-bank-1957');
        const scoreUI1957 = document.getElementById('score-1957');
        const winModal1957 = document.getElementById('win-modal-1957');

        // Input listeners for piggy bank
        area1957.addEventListener('mousemove', (e) => {
            if (isPlaying1957) piggyX = e.clientX;
        });
        area1957.addEventListener('touchmove', (e) => {
            if (isPlaying1957) {
                piggyX = e.touches[0].clientX;
                e.preventDefault(); // Prevent scrolling
            }
        }, { passive: false });

        function startMinigame1957() {
            score1957 = 0;
            piggyX = window.innerWidth / 2;
            coins1957.forEach(c => c.elem.remove());
            coins1957 = [];
            spawnTimer1957 = 0;
            
            scoreUI1957.innerText = `AOW-opbouw: 0 / ${TOTAL_COINS_1957} muntjes`;
            winModal1957.classList.remove('active');
            
            overlay1957.classList.add('active');
            isPlaying1957 = true;
            
            cancelAnimationFrame(loop1957);
            loop1957 = requestAnimationFrame(updateLoop1957);
        }

        function updateLoop1957() {
            if(!isPlaying1957) return;
            
            // Move piggy bank
            piggy1957.style.left = piggyX + 'px';
            
            // Spawn coins
            spawnTimer1957++;
            if (spawnTimer1957 > 15) { // Spawn rate
                spawnTimer1957 = 0;
                spawnCoin1957();
            }
            
            // Piggy bank hit box (approximate)
            const piggyRect = piggy1957.getBoundingClientRect();
            const hitY = window.innerHeight - 80; // approximate y pos of piggy bank
            
            // Move and check coins
            for (let i = coins1957.length - 1; i >= 0; i--) {
                const coin = coins1957[i];
                coin.y += coin.speed;
                coin.elem.style.top = coin.y + 'px';
                
                // Check collision
                if (coin.y > hitY - 40 && coin.y < hitY + 40) {
                    if (Math.abs(coin.x - piggyX) < 60) {
                        // Caught!
                        coin.elem.remove();
                        coins1957.splice(i, 1);
                        score1957++;
                        scoreUI1957.innerText = `AOW-opbouw: ${score1957} / ${TOTAL_COINS_1957} muntjes`;
                        
                        // Small bounce effect on piggy bank
                        piggy1957.style.transform = 'translateX(-50%) scale(1.2)';
                        setTimeout(() => { piggy1957.style.transform = 'translateX(-50%) scale(1)'; }, 100);
                        
                        if (score1957 >= TOTAL_COINS_1957) {
                            winMinigame1957();
                        }
                        continue; // skip to next coin
                    }
                }
                
                // Remove if off screen
                if (coin.y > window.innerHeight + 50) {
                    coin.elem.remove();
                    coins1957.splice(i, 1);
                }
            }
            
            if (isPlaying1957) {
                loop1957 = requestAnimationFrame(updateLoop1957);
            }
        }
        
        function spawnCoin1957() {
            if (score1957 + coins1957.length >= TOTAL_COINS_1957) return; // Don't overspawn
            
            const coinElem = document.createElement('div');
            coinElem.className = 'coin-1957';
            coinElem.innerText = 'ƒ'; // Gulden symbol
            
            const startX = Math.random() * (window.innerWidth - 60) + 30;
            const coinObj = {
                elem: coinElem,
                x: startX,
                y: -50,
                speed: Math.random() * 3 + 4 // Speed between 4 and 7
            };
            
            coinElem.style.left = startX + 'px';
            coinElem.style.top = '-50px';
            
            area1957.appendChild(coinElem);
            coins1957.push(coinObj);
        }

        function winMinigame1957() {
            isPlaying1957 = false;
            cancelAnimationFrame(loop1957);
            
            setTimeout(() => {
                winModal1957.classList.add('active');
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#FFD700', '#DAA520', '#FF69B4']
                });
            }, 500);
        }

        function finishMinigame1957() {
            overlay1957.classList.remove('active');
            setTimeout(() => completeGame(1957), 400);
        }
        // ==========================================

        // ==========================================
        // 1958 MINIGAME LOGIC
        // ==========================================
        const TOTAL_BLOCKS_1958 = 75;
        const COLUMNS_1958 = 15;
        let blocksPlaced1958 = 0;
        let isPlaying1958 = false;
        let craneLoop1958;
        let craneX1958 = 0; // percentage
        let craneDir1958 = 1;
        let columnHeights1958 = new Array(COLUMNS_1958).fill(0);
        
        const overlay1958 = document.getElementById('game-overlay-1958');
        const crane1958 = document.getElementById('crane-1958');
        const blocksContainer1958 = document.getElementById('blocks-container-1958');
        const scoreUI1958 = document.getElementById('score-1958');
        const winModal1958 = document.getElementById('win-modal-1958');

        function startMinigame1958() {
            blocksPlaced1958 = 0;
            craneX1958 = 0;
            craneDir1958 = 1;
            columnHeights1958.fill(0);
            blocksContainer1958.innerHTML = '';
            
            scoreUI1958.innerText = `Betonblokken geplaatst: 0 / ${TOTAL_BLOCKS_1958}`;
            winModal1958.classList.remove('active');
            
            overlay1958.classList.add('active');
            isPlaying1958 = true;
            
            cancelAnimationFrame(craneLoop1958);
            craneLoop1958 = requestAnimationFrame(updateCrane1958);
        }

        function updateCrane1958() {
            if (!isPlaying1958) return;
            
            craneX1958 += 1.5 * craneDir1958; // speed
            if (craneX1958 >= 95) { craneX1958 = 95; craneDir1958 = -1; }
            if (craneX1958 <= 0) { craneX1958 = 0; craneDir1958 = 1; }
            
            crane1958.style.left = craneX1958 + '%';
            
            if (isPlaying1958) craneLoop1958 = requestAnimationFrame(updateCrane1958);
        }

        function dropBlock1958() {
            if (!isPlaying1958 || blocksPlaced1958 >= TOTAL_BLOCKS_1958) return;
            
            // Calculate which column it falls into (0 to 14) based on crane position
            let col = Math.floor((craneX1958 / 100) * COLUMNS_1958);
            if (col >= COLUMNS_1958) col = COLUMNS_1958 - 1;
            
            const block = document.createElement('div');
            block.className = 'concrete-block-1958';
            block.style.left = (col * (100 / COLUMNS_1958)) + '%';
            block.style.bottom = '100%'; // Start at top
            
            blocksContainer1958.appendChild(block);
            
            // Target bottom in pixels based on how many blocks are in the column
            const targetBottom = columnHeights1958[col] * 40; 
            
            // Small delay to trigger CSS transition
            setTimeout(() => {
                block.style.bottom = targetBottom + 'px';
            }, 10);
            
            columnHeights1958[col]++;
            blocksPlaced1958++;
            
            scoreUI1958.innerText = `Betonblokken geplaatst: ${blocksPlaced1958} / ${TOTAL_BLOCKS_1958}`;
            
            if (blocksPlaced1958 >= TOTAL_BLOCKS_1958) {
                winMinigame1958();
            }
        }

        function winMinigame1958() {
            isPlaying1958 = false;
            cancelAnimationFrame(craneLoop1958);
            
            setTimeout(() => {
                winModal1958.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#7f8c8d', '#bdc3c7', '#3498db']
                });
            }, 500);
        }

        function finishMinigame1958() {
            overlay1958.classList.remove('active');
            setTimeout(() => completeGame(1958), 400);
        }
        // ==========================================

        // ==========================================
        // 1959 MINIGAME LOGIC
        // ==========================================
        const TOTAL_GAS_1959 = 75;
        const GRID_SIZE_1959 = 144; // 12x12
        let gasFound1959 = 0;
        let isPlaying1959 = false;
        let cellsData1959 = [];
        
        const overlay1959 = document.getElementById('game-overlay-1959');
        const grid1959 = document.getElementById('grid-1959');
        const scoreUI1959 = document.getElementById('score-1959');
        const winModal1959 = document.getElementById('win-modal-1959');

        function startMinigame1959() {
            gasFound1959 = 0;
            isPlaying1959 = true;
            scoreUI1959.innerText = `Gasbellen ontdekt: 0 / ${TOTAL_GAS_1959}`;
            winModal1959.classList.remove('active');
            
            // Generate board data
            cellsData1959 = new Array(GRID_SIZE_1959).fill(false);
            let placed = 0;
            while(placed < TOTAL_GAS_1959) {
                const idx = Math.floor(Math.random() * GRID_SIZE_1959);
                if (!cellsData1959[idx]) {
                    cellsData1959[idx] = true;
                    placed++;
                }
            }
            
            // Render grid
            grid1959.innerHTML = '';
            for(let i = 0; i < GRID_SIZE_1959; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell-1959';
                cell.onclick = () => clickCell1959(cell, i);
                grid1959.appendChild(cell);
            }
            
            overlay1959.classList.add('active');
        }

        function clickCell1959(cell, index) {
            if (!isPlaying1959 || cell.classList.contains('revealed-gas') || cell.classList.contains('revealed-empty')) return;
            
            if (cellsData1959[index]) {
                cell.classList.add('revealed-gas');
                cell.innerText = '🔥';
                gasFound1959++;
                scoreUI1959.innerText = `Gasbellen ontdekt: ${gasFound1959} / ${TOTAL_GAS_1959}`;
                
                if (gasFound1959 >= TOTAL_GAS_1959) {
                    winMinigame1959();
                }
            } else {
                cell.classList.add('revealed-empty');
            }
        }

        function winMinigame1959() {
            isPlaying1959 = false;
            setTimeout(() => {
                winModal1959.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 120,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#03a9f4', '#81d4fa', '#e1f5fe']
                });
            }, 400);
        }

        function finishMinigame1959() {
            overlay1959.classList.remove('active');
            setTimeout(() => completeGame(1959), 400);
        }
        // ==========================================

        // ==========================================
        // 1960 MINIGAME LOGIC
        // ==========================================
        const TOTAL_DOCS_1960 = 75;
        let docsProcessed1960 = 0;
        let isPlaying1960 = false;
        let activeDocs1960 = 0;
        let spawnTimeout1960;
        
        const overlay1960 = document.getElementById('game-overlay-1960');
        const deskArea1960 = document.getElementById('desk-area-1960');
        const scoreUI1960 = document.getElementById('score-1960');
        const clockUI1960 = document.getElementById('clock-1960');
        const winModal1960 = document.getElementById('win-modal-1960');

        function startMinigame1960() {
            docsProcessed1960 = 0;
            activeDocs1960 = 0;
            isPlaying1960 = true;
            deskArea1960.innerHTML = ''; // clear docs
            clearTimeout(spawnTimeout1960);
            
            updateUI1960();
            winModal1960.classList.remove('active');
            overlay1960.classList.add('active');
            
            // Initial spawn
            for(let i=0; i<3; i++) {
                spawnDocument1960();
            }
        }
        
        function updateUI1960() {
            scoreUI1960.innerText = `Dossiers verwerkt: ${docsProcessed1960} / ${TOTAL_DOCS_1960}`;
            
            // Map 0 -> 75 to 09:00 -> 17:00 (8 hours = 480 minutes)
            const totalMinutes = Math.floor((docsProcessed1960 / TOTAL_DOCS_1960) * 480);
            const hours = 9 + Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            
            const hStr = hours < 10 ? '0'+hours : hours;
            const mStr = mins < 10 ? '0'+mins : mins;
            clockUI1960.innerText = `${hStr}:${mStr}`;
        }

        function spawnDocument1960() {
            if (!isPlaying1960 || docsProcessed1960 + activeDocs1960 >= TOTAL_DOCS_1960) return;
            if (activeDocs1960 >= 6) {
                // Don't clutter too much, try again shortly
                spawnTimeout1960 = setTimeout(spawnDocument1960, 500);
                return;
            }
            
            const doc = document.createElement('div');
            doc.className = 'document-1960';
            doc.style.pointerEvents = 'all'; // allow clicks
            
            // Random position (avoiding extreme edges and UI)
            const padding = 100;
            const maxX = window.innerWidth - padding - 60;
            const maxY = window.innerHeight - padding - 80;
            
            let x = Math.random() * maxX + (padding/2);
            let y = Math.random() * maxY + (padding/2);
            
            // Avoid clock area (top right) and score area (top center)
            if (y < 120) y = 120 + Math.random() * 100;
            
            doc.style.left = x + 'px';
            doc.style.top = y + 'px';
            doc.style.transform = `rotate(${(Math.random() - 0.5) * 60}deg)`; // random rotation
            
            // Interaction
            doc.onmousedown = () => processDocument1960(doc);
            doc.ontouchstart = (e) => { e.preventDefault(); processDocument1960(doc); };
            
            deskArea1960.appendChild(doc);
            activeDocs1960++;
            
            // Schedule next spawn based on how many are active (faster if desk is empty)
            const delay = Math.random() * 400 + 200;
            spawnTimeout1960 = setTimeout(spawnDocument1960, delay);
        }
        
        function processDocument1960(docElem) {
            if (!isPlaying1960) return;
            
            // "Stamp" effect
            docElem.innerHTML = '<span style="color:red; font-size: 1.5rem; transform: rotate(-15deg); font-family: serif; border: 2px solid red; padding: 2px; border-radius: 4px;">OK</span>';
            docElem.onmousedown = null;
            docElem.ontouchstart = null;
            
            setTimeout(() => {
                docElem.remove();
                activeDocs1960--;
                docsProcessed1960++;
                updateUI1960();
                
                if (docsProcessed1960 >= TOTAL_DOCS_1960) {
                    winMinigame1960();
                } else if (activeDocs1960 < 2) {
                    // Force a spawn if we cleared too fast
                    spawnDocument1960();
                }
            }, 100);
        }

        function winMinigame1960() {
            isPlaying1960 = false;
            clearTimeout(spawnTimeout1960);
            
            setTimeout(() => {
                winModal1960.classList.add('active');
                confetti({
                    particleCount: 200,
                    spread: 120,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#ffffff', '#f1c40f', '#e74c3c']
                });
            }, 400);
        }

        function finishMinigame1960() {
            overlay1960.classList.remove('active');
            setTimeout(() => completeGame(1960), 400);
        }
        // ==========================================

        // ==========================================
        // 1961 MINIGAME LOGIC
        // ==========================================
        const TOTAL_WALLS_1961 = 75;
        let score1961 = 0;
        let isPlaying1961 = false;
        let loop1961;
        let spawnTimer1961 = 0;
        let walls1961 = [];
        let playerX1961 = window.innerWidth / 2;
        let keys1961 = { left: false, right: false };
        
        const overlay1961 = document.getElementById('game-overlay-1961');
        const area1961 = document.getElementById('game-area-1961');
        const player1961 = document.getElementById('player-1961');
        const scoreUI1961 = document.getElementById('score-1961');
        const winModal1961 = document.getElementById('win-modal-1961');

        // Input listeners for player
        area1961.addEventListener('mousemove', (e) => {
            if (isPlaying1961) playerX1961 = e.clientX;
        });
        area1961.addEventListener('touchmove', (e) => {
            if (isPlaying1961) {
                playerX1961 = e.touches[0].clientX;
                e.preventDefault();
            }
        }, { passive: false });
        
        // Arrow keys input
        document.addEventListener('keydown', (e) => {
            if(!isPlaying1961) return;
            if(e.key === 'ArrowLeft') keys1961.left = true;
            if(e.key === 'ArrowRight') keys1961.right = true;
        });
        document.addEventListener('keyup', (e) => {
            if(!isPlaying1961) return;
            if(e.key === 'ArrowLeft') keys1961.left = false;
            if(e.key === 'ArrowRight') keys1961.right = false;
        });

        function startMinigame1961() {
            score1961 = 0;
            playerX1961 = window.innerWidth / 2;
            keys1961 = { left: false, right: false };
            walls1961.forEach(w => w.elem.remove());
            walls1961 = [];
            spawnTimer1961 = 0;
            overlay1961.classList.remove('flash-red');
            
            scoreUI1961.innerText = `Muren ontweken: 0 / ${TOTAL_WALLS_1961}`;
            winModal1961.classList.remove('active');
            
            overlay1961.classList.add('active');
            isPlaying1961 = true;
            
            cancelAnimationFrame(loop1961);
            loop1961 = requestAnimationFrame(updateLoop1961);
        }

        function updateLoop1961() {
            if(!isPlaying1961) return;
            
            // Keyboard logic
            if (keys1961.left) playerX1961 -= 7;
            if (keys1961.right) playerX1961 += 7;
            
            // Constraint
            if (playerX1961 < 15) playerX1961 = 15;
            if (playerX1961 > window.innerWidth - 15) playerX1961 = window.innerWidth - 15;
            
            player1961.style.left = playerX1961 + 'px';
            
            // Spawn walls
            spawnTimer1961++;
            if (spawnTimer1961 > 45) { // Spawn rate
                spawnTimer1961 = 0;
                spawnWallPair1961();
            }
            
            const hitY = window.innerHeight - 40; // Player bottom center roughly at window.innerHeight - 40
            const playerRect = { left: playerX1961 - 15, right: playerX1961 + 15, top: hitY - 30, bottom: hitY };
            
            // Move walls
            for (let i = walls1961.length - 1; i >= 0; i--) {
                const wall = walls1961[i];
                wall.y += wall.speed;
                wall.elem.style.top = wall.y + 'px';
                
                const wallRect = { left: wall.x, right: wall.x + wall.width, top: wall.y, bottom: wall.y + 30 };
                
                // Collision check
                if (!wall.passed && !wall.hit) {
                    if (playerRect.left < wallRect.right && playerRect.right > wallRect.left &&
                        playerRect.top < wallRect.bottom && playerRect.bottom > wallRect.top) {
                        
                        wall.hit = true;
                        if (wall.pair) wall.pair.hit = true; // Mark pair as hit so we don't flash twice
                        
                        overlay1961.classList.add('flash-red');
                        setTimeout(() => { if (isPlaying1961) overlay1961.classList.remove('flash-red'); }, 200);
                    }
                }
                
                // Scored (Passed player)
                if (!wall.passed && wall.y > hitY + 30) {
                    wall.passed = true;
                    // Only score once per row (use the left wall as scorer)
                    if (wall.isScorer && !wall.hit) {
                        score1961++;
                        scoreUI1961.innerText = `Muren ontweken: ${score1961} / ${TOTAL_WALLS_1961}`;
                        if (score1961 >= TOTAL_WALLS_1961) {
                            winMinigame1961();
                        }
                    }
                }
                
                // Remove if off screen
                if (wall.y > window.innerHeight + 50) {
                    wall.elem.remove();
                    walls1961.splice(i, 1);
                }
            }
            
            if (isPlaying1961) {
                loop1961 = requestAnimationFrame(updateLoop1961);
            }
        }
        
        function spawnWallPair1961() {
            if (score1961 >= TOTAL_WALLS_1961) return;
            
            const gapWidth = 100; // Gap for player to pass through
            const maxLeftWidth = window.innerWidth - gapWidth - 20; 
            let leftWidth = Math.random() * maxLeftWidth + 10;
            
            if(leftWidth < 0) leftWidth = 0;
            
            const speed = 4 + Math.random() * 3; // Speed between 4 and 7
            
            // Left Wall
            const lwElem = document.createElement('div');
            lwElem.className = 'wall-1961';
            lwElem.style.left = '0px';
            lwElem.style.width = leftWidth + 'px';
            lwElem.style.top = '-50px';
            area1961.appendChild(lwElem);
            
            const lw = { elem: lwElem, x: 0, y: -50, width: leftWidth, speed: speed, passed: false, hit: false, isScorer: true, pair: null };
            
            // Right Wall
            const rightX = leftWidth + gapWidth;
            const rightWidth = window.innerWidth - rightX;
            const rwElem = document.createElement('div');
            rwElem.className = 'wall-1961';
            rwElem.style.left = rightX + 'px';
            rwElem.style.width = rightWidth + 'px';
            rwElem.style.top = '-50px';
            area1961.appendChild(rwElem);
            
            const rw = { elem: rwElem, x: rightX, y: -50, width: rightWidth, speed: speed, passed: false, hit: false, isScorer: false, pair: lw };
            lw.pair = rw;
            
            walls1961.push(lw, rw);
        }

        function winMinigame1961() {
            isPlaying1961 = false;
            cancelAnimationFrame(loop1961);
            
            setTimeout(() => {
                winModal1961.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#c0392b', '#7f8c8d', '#bdc3c7']
                });
            }, 300);
        }

        function finishMinigame1961() {
            overlay1961.classList.remove('active');
            setTimeout(() => completeGame(1961), 400);
        }
        // ==========================================

        // ==========================================
        // 1962 MINIGAME LOGIC
        // ==========================================
        const TOTAL_MAP_PIECES_1962 = 75;
        let piecesPlaced1962 = 0;
        let isPlaying1962 = false;
        let isDragging1962 = false;
        
        const overlay1962 = document.getElementById('game-overlay-1962');
        const mapGrid1962 = document.getElementById('map-grid-1962');
        const scoreUI1962 = document.getElementById('score-1962');
        const winModal1962 = document.getElementById('win-modal-1962');

        function startMinigame1962() {
            piecesPlaced1962 = 0;
            isPlaying1962 = true;
            isDragging1962 = false;
            
            scoreUI1962.innerText = \`Kaartstukken geplaatst: 0 / \${TOTAL_MAP_PIECES_1962}\`;
            winModal1962.classList.remove('active');
            
            // Generate grid
            mapGrid1962.innerHTML = '';
            for(let i = 0; i < TOTAL_MAP_PIECES_1962; i++) {
                const cell = document.createElement('div');
                cell.className = 'map-cell-1962';
                
                // Mouse events for drag-to-paint
                cell.addEventListener('mousedown', (e) => {
                    isDragging1962 = true;
                    revealMapPiece1962(cell);
                    e.preventDefault();
                });
                cell.addEventListener('mouseenter', () => {
                    if(isDragging1962) revealMapPiece1962(cell);
                });
                
                mapGrid1962.appendChild(cell);
            }
            
            // Global mouse up to stop dragging
            window.addEventListener('mouseup', stopDragging1962);
            
            // Touch events for mobile swipe
            mapGrid1962.addEventListener('touchmove', handleTouchMove1962, {passive: false});
            
            overlay1962.classList.add('active');
        }

        function stopDragging1962() {
            isDragging1962 = false;
        }

        function handleTouchMove1962(e) {
            if(!isPlaying1962) return;
            e.preventDefault(); // Prevent scrolling while drawing the map
            const touch = e.touches[0];
            const elem = document.elementFromPoint(touch.clientX, touch.clientY);
            if(elem && elem.classList.contains('map-cell-1962')) {
                revealMapPiece1962(elem);
            }
        }

        function revealMapPiece1962(cell) {
            if(!isPlaying1962 || cell.classList.contains('revealed')) return;
            
            cell.classList.add('revealed');
            piecesPlaced1962++;
            scoreUI1962.innerText = \`Kaartstukken geplaatst: \${piecesPlaced1962} / \${TOTAL_MAP_PIECES_1962}\`;
            
            if(piecesPlaced1962 >= TOTAL_MAP_PIECES_1962) {
                winMinigame1962();
            }
        }

        function winMinigame1962() {
            isPlaying1962 = false;
            window.removeEventListener('mouseup', stopDragging1962);
            mapGrid1962.removeEventListener('touchmove', handleTouchMove1962);
            
            setTimeout(() => {
                winModal1962.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#689f38', '#8bc34a', '#4caf50']
                });
            }, 300);
        }

        function finishMinigame1962() {
            overlay1962.classList.remove('active');
            setTimeout(() => completeGame(1962), 400);
        }
        // ==========================================

        // ==========================================
        // 1963 MINIGAME LOGIC
        // ==========================================
        const TOTAL_OBS_1963 = 75;
        let score1963 = 0;
        let isPlaying1963 = false;
        let loop1963;
        let spawnTimer1963 = 0;
        let obstacles1963 = [];
        let playerX1963 = window.innerWidth / 2;
        let keys1963 = { left: false, right: false };
        
        const overlay1963 = document.getElementById('game-overlay-1963');
        const area1963 = document.getElementById('game-area-1963');
        const player1963 = document.getElementById('player-1963');
        const scoreUI1963 = document.getElementById('score-1963');
        const winModal1963 = document.getElementById('win-modal-1963');

        // Input listeners for player 1963
        area1963.addEventListener('mousemove', (e) => {
            if (isPlaying1963) playerX1963 = e.clientX;
        });
        area1963.addEventListener('touchmove', (e) => {
            if (isPlaying1963) {
                playerX1963 = e.touches[0].clientX;
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('keydown', (e) => {
            if(!isPlaying1963) return;
            if(e.key === 'ArrowLeft') keys1963.left = true;
            if(e.key === 'ArrowRight') keys1963.right = true;
        });
        document.addEventListener('keyup', (e) => {
            if(!isPlaying1963) return;
            if(e.key === 'ArrowLeft') keys1963.left = false;
            if(e.key === 'ArrowRight') keys1963.right = false;
        });

        function startMinigame1963() {
            score1963 = 0;
            playerX1963 = window.innerWidth / 2;
            keys1963 = { left: false, right: false };
            obstacles1963.forEach(o => o.elem.remove());
            obstacles1963 = [];
            spawnTimer1963 = 0;
            overlay1963.classList.remove('flash-hit');
            
            scoreUI1963.innerText = \`Obstakels ontweken: 0 / \${TOTAL_OBS_1963}\`;
            winModal1963.classList.remove('active');
            
            overlay1963.classList.add('active');
            isPlaying1963 = true;
            
            cancelAnimationFrame(loop1963);
            loop1963 = requestAnimationFrame(updateLoop1963);
        }

        function updateLoop1963() {
            if(!isPlaying1963) return;
            
            if (keys1963.left) playerX1963 -= 7;
            if (keys1963.right) playerX1963 += 7;
            
            if (playerX1963 < 20) playerX1963 = 20;
            if (playerX1963 > window.innerWidth - 20) playerX1963 = window.innerWidth - 20;
            
            player1963.style.left = playerX1963 + 'px';
            
            spawnTimer1963++;
            if (spawnTimer1963 > 30) { // Spawn rate
                spawnTimer1963 = 0;
                spawnObstacle1963();
            }
            
            const hitY = window.innerHeight - 40; 
            const playerRect = { left: playerX1963 - 20, right: playerX1963 + 20, top: hitY - 40, bottom: hitY };
            
            for (let i = obstacles1963.length - 1; i >= 0; i--) {
                const obs = obstacles1963[i];
                obs.y += obs.speed;
                obs.elem.style.top = obs.y + 'px';
                
                const obsRect = { left: obs.x, right: obs.x + obs.size, top: obs.y, bottom: obs.y + obs.size };
                
                // Collision
                if (!obs.passed && !obs.hit) {
                    // Circle to rect rough collision
                    if (playerRect.left < obsRect.right && playerRect.right > obsRect.left &&
                        playerRect.top < obsRect.bottom && playerRect.bottom > obsRect.top) {
                        
                        obs.hit = true;
                        
                        overlay1963.classList.add('flash-hit');
                        setTimeout(() => { if (isPlaying1963) overlay1963.classList.remove('flash-hit'); }, 150);
                    }
                }
                
                // Score
                if (!obs.passed && obs.y > hitY + 20) {
                    obs.passed = true;
                    if (!obs.hit) {
                        score1963++;
                        scoreUI1963.innerText = \`Obstakels ontweken: \${score1963} / \${TOTAL_OBS_1963}\`;
                        if (score1963 >= TOTAL_OBS_1963) {
                            winMinigame1963();
                        }
                    }
                }
                
                // Remove
                if (obs.y > window.innerHeight + 100) {
                    obs.elem.remove();
                    obstacles1963.splice(i, 1);
                }
            }
            
            if (isPlaying1963) {
                loop1963 = requestAnimationFrame(updateLoop1963);
            }
        }
        
        function spawnObstacle1963() {
            if (score1963 >= TOTAL_OBS_1963) return;
            
            const isHole = Math.random() > 0.5;
            const size = isHole ? (Math.random() * 40 + 40) : (Math.random() * 60 + 30); // 40-80 or 30-90
            const x = Math.random() * (window.innerWidth - size);
            const speed = 5 + Math.random() * 5;
            
            const elem = document.createElement('div');
            elem.className = \`obstacle-1963 \${isHole ? 'obs-hole' : 'obs-dune'}\`;
            elem.style.left = x + 'px';
            elem.style.top = '-100px';
            elem.style.width = size + 'px';
            elem.style.height = (isHole ? size : size * 0.7) + 'px';
            
            area1963.appendChild(elem);
            
            obstacles1963.push({ elem, x, y: -100, size, speed, passed: false, hit: false });
        }

        function winMinigame1963() {
            isPlaying1963 = false;
            cancelAnimationFrame(loop1963);
            
            setTimeout(() => {
                winModal1963.classList.add('active');
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#ffffff', '#e0f7fa', '#006064']
                });
            }, 300);
        }

        function finishMinigame1963() {
            overlay1963.classList.remove('active');
            setTimeout(() => completeGame(1963), 400);
        }
        // ==========================================

        // ==========================================
        // 1964 MINIGAME LOGIC
        // ==========================================
        const TOTAL_CHORDS_1964 = 75;
        let score1964 = 0;
        let isPlaying1964 = false;
        let loop1964;
        let spawnTimer1964 = 0;
        let notes1964 = [];
        
        const overlay1964 = document.getElementById('game-overlay-1964');
        const track1964 = document.getElementById('track-1964');
        const hitzone1964 = document.getElementById('hitzone-1964');
        const scoreUI1964 = document.getElementById('score-1964');
        const winModal1964 = document.getElementById('win-modal-1964');

        function handleSpacebar1964(e) {
            if (isPlaying1964 && e.code === 'Space') {
                e.preventDefault();
                tryHit1964();
            }
        }

        function startMinigame1964() {
            score1964 = 0;
            notes1964.forEach(n => n.elem.remove());
            notes1964 = [];
            spawnTimer1964 = 0;
            
            scoreUI1964.innerText = \`Akkoorden geraakt: 0 / \${TOTAL_CHORDS_1964}\`;
            winModal1964.classList.remove('active');
            
            document.addEventListener('keydown', handleSpacebar1964);
            
            overlay1964.classList.add('active');
            isPlaying1964 = true;
            
            cancelAnimationFrame(loop1964);
            loop1964 = requestAnimationFrame(updateLoop1964);
        }

        function updateLoop1964() {
            if (!isPlaying1964) return;
            
            spawnTimer1964++;
            if (spawnTimer1964 > 35) {
                spawnTimer1964 = 0;
                spawnNote1964();
            }
            
            for (let i = notes1964.length - 1; i >= 0; i--) {
                let n = notes1964[i];
                if (!n.hit) {
                    n.y += n.speed;
                    n.elem.style.top = n.y + 'px';
                }
                
                if (n.y > window.innerHeight + 100) {
                    n.elem.remove();
                    notes1964.splice(i, 1);
                }
            }
            
            if (isPlaying1964) {
                loop1964 = requestAnimationFrame(updateLoop1964);
            }
        }

        function spawnNote1964() {
            if (score1964 >= TOTAL_CHORDS_1964) return;
            const elem = document.createElement('div');
            elem.className = 'note-1964';
            elem.innerText = '🎵';
            elem.style.top = '-80px';
            
            // Randomize color a bit
            const colors = ['#e74c3c', '#9b59b6', '#3498db', '#e67e22'];
            elem.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            track1964.appendChild(elem);
            
            notes1964.push({ elem, y: -80, speed: 6 + Math.random() * 4, hit: false });
        }

        function tryHit1964() {
            if (!isPlaying1964) return;
            
            hitzone1964.classList.add('active');
            setTimeout(() => hitzone1964.classList.remove('active'), 100);
            
            const hzRect = hitzone1964.getBoundingClientRect();
            
            for (let i = 0; i < notes1964.length; i++) {
                let n = notes1964[i];
                if (n.hit) continue;
                
                const nRect = n.elem.getBoundingClientRect();
                
                // Check if note visually overlaps the hit zone
                if (nRect.bottom > hzRect.top + 10 && nRect.top < hzRect.bottom - 10) {
                    n.hit = true;
                    n.elem.classList.add('hit');
                    score1964++;
                    scoreUI1964.innerText = \`Akkoorden geraakt: \${score1964} / \${TOTAL_CHORDS_1964}\`;
                    
                    if (score1964 >= TOTAL_CHORDS_1964) {
                        winMinigame1964();
                    }
                    break; // one hit per press
                }
            }
        }

        function winMinigame1964() {
            isPlaying1964 = false;
            cancelAnimationFrame(loop1964);
            document.removeEventListener('keydown', handleSpacebar1964);
            
            setTimeout(() => {
                winModal1964.classList.add('active');
                confetti({
                    particleCount: 200,
                    spread: 120,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#f1c40f', '#e74c3c', '#3498db', '#9b59b6']
                });
            }, 300);
        }

        function finishMinigame1964() {
            overlay1964.classList.remove('active');
            setTimeout(() => completeGame(1964), 400);
        }
        // ==========================================

        // ==========================================
        // 1965 MINIGAME LOGIC
        // ==========================================
        const TOTAL_CHECKPOINTS_1965 = 75;
        let score1965 = 0;
        let isPlaying1965 = false;
        let loop1965;
        let checkpoints1965 = [];
        
        let playerX1965 = window.innerWidth / 2;
        let playerY1965 = window.innerHeight / 2;
        let keys1965 = { up: false, down: false, left: false, right: false };
        let currentScaleX1965 = 1;
        let currentScaleY1965 = 1;

        const overlay1965 = document.getElementById('game-overlay-1965');
        const area1965 = document.getElementById('game-area-1965');
        const player1965 = document.getElementById('player-1965');
        const scoreUI1965 = document.getElementById('score-1965');
        const winModal1965 = document.getElementById('win-modal-1965');

        function handleKeyDown1965(e) {
            if(!isPlaying1965) return;
            if(e.key === 'ArrowUp') { keys1965.up = true; e.preventDefault(); }
            if(e.key === 'ArrowDown') { keys1965.down = true; e.preventDefault(); }
            if(e.key === 'ArrowLeft') { keys1965.left = true; e.preventDefault(); }
            if(e.key === 'ArrowRight') { keys1965.right = true; e.preventDefault(); }
        }
        function handleKeyUp1965(e) {
            if(!isPlaying1965) return;
            if(e.key === 'ArrowUp') keys1965.up = false;
            if(e.key === 'ArrowDown') keys1965.down = false;
            if(e.key === 'ArrowLeft') keys1965.left = false;
            if(e.key === 'ArrowRight') keys1965.right = false;
        }

        // DPAD button handler
        function setDir1965(dir, state) {
            if(isPlaying1965) keys1965[dir] = state;
        }

        function startMinigame1965() {
            score1965 = 0;
            checkpoints1965.forEach(c => c.elem.remove());
            checkpoints1965 = [];
            
            playerX1965 = window.innerWidth / 2;
            playerY1965 = window.innerHeight / 2;
            keys1965 = { up: false, down: false, left: false, right: false };
            currentScaleX1965 = 1;
            
            scoreUI1965.innerText = \`Checkpoints bereikt: 0 / \${TOTAL_CHECKPOINTS_1965}\`;
            winModal1965.classList.remove('active');
            
            document.addEventListener('keydown', handleKeyDown1965);
            document.addEventListener('keyup', handleKeyUp1965);
            
            // Spawn initial 5 checkpoints
            for(let i = 0; i < 5; i++) {
                spawnCheckpoint1965();
            }
            
            overlay1965.classList.add('active');
            isPlaying1965 = true;
            
            cancelAnimationFrame(loop1965);
            loop1965 = requestAnimationFrame(updateLoop1965);
        }

        function updateLoop1965() {
            if (!isPlaying1965) return;
            
            const speed = 7; // Bicycle speed
            
            if(keys1965.up) playerY1965 -= speed;
            if(keys1965.down) playerY1965 += speed;
            if(keys1965.left) { playerX1965 -= speed; currentScaleX1965 = -1; }
            if(keys1965.right) { playerX1965 += speed; currentScaleX1965 = 1; }
            
            // Boundaries
            if(playerX1965 < 20) playerX1965 = 20;
            if(playerX1965 > window.innerWidth - 20) playerX1965 = window.innerWidth - 20;
            if(playerY1965 < 20) playerY1965 = 20;
            if(playerY1965 > window.innerHeight - 20) playerY1965 = window.innerHeight - 20;
            
            player1965.style.left = (playerX1965 - 20) + 'px';
            player1965.style.top = (playerY1965 - 20) + 'px';
            player1965.style.transform = \`scaleX(\${currentScaleX1965})\`;
            
            // Collision detection with checkpoints
            for(let i = checkpoints1965.length - 1; i >= 0; i--) {
                let cp = checkpoints1965[i];
                let dist = Math.hypot(playerX1965 - cp.x, playerY1965 - cp.y);
                
                if(dist < 30) {
                    // Collected!
                    cp.elem.remove();
                    checkpoints1965.splice(i, 1);
                    score1965++;
                    scoreUI1965.innerText = \`Checkpoints bereikt: \${score1965} / \${TOTAL_CHECKPOINTS_1965}\`;
                    
                    if(score1965 >= TOTAL_CHECKPOINTS_1965) {
                        winMinigame1965();
                        return;
                    } else if (score1965 + checkpoints1965.length < TOTAL_CHECKPOINTS_1965) {
                        spawnCheckpoint1965();
                    }
                }
            }
            
            if(isPlaying1965) {
                loop1965 = requestAnimationFrame(updateLoop1965);
            }
        }

        function spawnCheckpoint1965() {
            // Keep points away from edges
            const pad = 50;
            const x = pad + Math.random() * (window.innerWidth - pad * 2);
            const y = pad + Math.random() * (window.innerHeight - pad * 2);
            
            const elem = document.createElement('div');
            elem.className = 'checkpoint-1965';
            elem.style.left = (x - 12) + 'px';
            elem.style.top = (y - 12) + 'px';
            area1965.appendChild(elem);
            
            checkpoints1965.push({elem, x, y});
        }

        function winMinigame1965() {
            isPlaying1965 = false;
            cancelAnimationFrame(loop1965);
            document.removeEventListener('keydown', handleKeyDown1965);
            document.removeEventListener('keyup', handleKeyUp1965);
            
            setTimeout(() => {
                winModal1965.classList.add('active');
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    zIndex: 2500,
                    colors: ['#ffffff', '#ecf0f1', '#e74c3c'] // Provo white and a touch of red
                });
            }, 300);
        }

        function finishMinigame1965() {
            overlay1965.classList.remove('active');
            setTimeout(() => completeGame(1965), 400);
        }
        // ==========================================

        // Update Counter & Progress Bar
        function updateDashboard(animateEvents = false) {
            const completedCount = completedGames.length;
            const percentage = (completedCount / TOTAL_YEARS) * 100;
            
            progressBar.style.width = `${percentage}%`;
            
            // Animate counter
            let displayedAge = completedCount === 0 ? "-" : (completedCount - 1).toString();
            let startVal = ageCounter.innerText;
            if(startVal !== displayedAge) {
                ageCounter.innerText = displayedAge; 
                ageCounter.style.transform = 'scale(1.3)';
                setTimeout(() => { ageCounter.style.transform = 'scale(1)'; }, 200);
            }

            // Trigger Final Celebration
            if (completedCount === TOTAL_YEARS && animateEvents) {
                setTimeout(() => {
                    triggerGrandConfetti();
                    modal.classList.add('active');
                }, 800);
            }
        }

        // Epic Confetti Explosion
        function triggerGrandConfetti() {
            var duration = 5 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 4000 };

            function randomInRange(min, max) { return Math.random() * (max - min) + min; }

            var interval = setInterval(function() {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#FFD700', '#E63946', '#FFFFFF', '#0A192F']
                }));
                confetti(Object.assign({}, defaults, { particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#FFD700', '#E63946', '#FFFFFF', '#0A192F']
                }));
            }, 250);
        }

        // Modal close
        function closeModal() {
            modal.classList.remove('active');
        }

        // Reset functionality
        resetBtn.addEventListener('click', () => {
            if(confirm('Weet je zeker dat je alle voortgang wilt resetten? Handig om het opnieuw te testen!')) {
                completedGames = [];
                localStorage.removeItem('jubilee_progress');
                initGrid();
                progressBar.style.width = '0%';
                ageCounter.innerText = '-';
            }
        });

        // Initialize App
        createAmbientBalloons();
        initGrid();
    