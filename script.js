document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-button');
    
    // When clicking on a menu button
    menuButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent event from bubbling up
            
            // Close all other menus first
            const allMenus = document.querySelectorAll('.menu');
            allMenus.forEach(m => {
                if (m !== this.nextElementSibling) {
                    m.classList.add('hidden');
                }
            });
            
            // Toggle the current menu
            const menu = this.nextElementSibling;
            menu.classList.toggle('hidden');
        });
    });

    // Close any open menu when clicking elsewhere on the page
    document.addEventListener('click', function(event) {
        const menus = document.querySelectorAll('.menu');
        menus.forEach(menu => {
            // If the click is not on the menu or the menu button
            if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    });
});

// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', 
            document.documentElement.classList.contains('dark') ? 'enabled' : 'disabled'
        );
    });

    // Category Navigation
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sections = document.querySelectorAll('.category-section');

    function showCategory(category) {
        sections.forEach(section => {
            if (section.dataset.category === category) {
                section.style.display = 'block';
                section.classList.add('animate-fade-in');
            } else {
                section.style.display = 'none';
                section.classList.remove('animate-fade-in');
            }
        });

        categoryButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
                btn.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
            } else {
                btn.classList.remove('bg-indigo-100', 'dark:bg-indigo-900', 'text-indigo-600', 'dark:text-indigo-400');
                btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-600', 'dark:text-gray-400');
            }
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            showCategory(category);
            // Save active category to localStorage
            localStorage.setItem('activeCategory', category);
        });
    });

    // Show the last active category or default to 'layout'
    const activeCategory = localStorage.getItem('activeCategory') || 'layout';
    showCategory(activeCategory);

    // Initialize ClipboardJS for individual class copies
    const clipboard = new ClipboardJS('.copy-class', {
        text: function(trigger) {
            return trigger.getAttribute('data-clipboard-text');
        }
    });

    // Initialize ClipboardJS for section copies
    const clipboardSection = new ClipboardJS('.copy-section', {
        text: function(trigger) {
            return trigger.getAttribute('data-clipboard-text');
        }
    });
    
    [clipboard, clipboardSection].forEach(clip => {
        clip.on('success', (e) => {
            const originalText = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
            
            setTimeout(() => {
                e.trigger.innerHTML = originalText;
            }, 2000);
            
            e.clearSelection();
        });

        clip.on('error', (e) => {
            const originalText = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="fas fa-times mr-1"></i> Failed!';
            
            setTimeout(() => {
                e.trigger.innerHTML = originalText;
            }, 2000);
        });
    });

    // Enhanced Search functionality
    const searchInput = document.getElementById('search');
    const exampleBlocks = document.querySelectorAll('.example-block');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show everything when search is empty
            sections.forEach(section => section.style.display = 'block');
            exampleBlocks.forEach(block => {
                block.style.display = 'block';
                block.querySelectorAll('.class-example').forEach(el => {
                    el.style.backgroundColor = '';
                });
            });
            return;
        }

        sections.forEach(section => {
            const blocks = section.querySelectorAll('.example-block');
            let hasVisibleBlock = false;

            blocks.forEach(block => {
                const content = block.textContent.toLowerCase();
                const classes = block.querySelectorAll('.class-example');
                let blockVisible = false;

                // Check if any class in the block matches the search
                classes.forEach(classEl => {
                    if (classEl.textContent.toLowerCase().includes(searchTerm)) {
                        classEl.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                        blockVisible = true;
                    } else {
                        classEl.style.backgroundColor = '';
                    }
                });

                // Also check the block title/description
                if (content.includes(searchTerm)) {
                    blockVisible = true;
                }

                block.style.display = blockVisible ? 'block' : 'none';
                if (blockVisible) hasVisibleBlock = true;
            });

            section.style.display = hasVisibleBlock ? 'block' : 'none';

            // If there are visible blocks, switch to that category
            if (hasVisibleBlock) {
                showCategory(section.dataset.category);
            }
        });
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});