/**
 * HOBSESA - XYZ School Ex-Student Association
 * Interactive Scripting (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Mobile Navbar Toggle & Backdrop Overlay
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create dynamic backdrop overlay for mobile menu drawer
    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        document.body.appendChild(navBackdrop);
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when links or backdrop are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        navBackdrop.addEventListener('click', closeMobileMenu);

        // ESC key listener to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        if (!navToggle || !navMenu) return;
        navToggle.classList.add('open');
        navMenu.classList.add('open');
        navBackdrop.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }

    function closeMobileMenu() {
        if (!navToggle || !navMenu) return;
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navBackdrop.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
    }


    // ==========================================================================
    // 2. Sticky Navbar & Active Section Highlighting
    // ==========================================================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        // Sticky Header Color Change
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting based on Scroll Position
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Account for navbar height
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    // Trigger on load in case the user reloads midway
    handleScroll();


    // ==========================================================================
    // 3. About Section Sub-Tabs Logic
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and target tab pane
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Read More / Read Less toggle for History text on mobile & tablet
    const btnHistoryReadMore = document.getElementById('btn-history-read-more');
    const historyMoreContent = document.getElementById('history-more-content');

    if (btnHistoryReadMore && historyMoreContent) {
        btnHistoryReadMore.addEventListener('click', () => {
            const isExpanded = historyMoreContent.classList.contains('expanded');
            const btnText = btnHistoryReadMore.querySelector('.btn-read-text');
            const btnIcon = btnHistoryReadMore.querySelector('.btn-read-icon');

            if (isExpanded) {
                historyMoreContent.classList.remove('expanded');
                btnHistoryReadMore.classList.remove('active');
                btnHistoryReadMore.setAttribute('aria-expanded', 'false');
                if (btnText) btnText.textContent = 'Read Full History & Birth of HOBSESA';
                if (btnIcon) btnIcon.textContent = '↓';
            } else {
                historyMoreContent.classList.add('expanded');
                btnHistoryReadMore.classList.add('active');
                btnHistoryReadMore.setAttribute('aria-expanded', 'true');
                if (btnText) btnText.textContent = 'Show Less History';
                if (btnIcon) btnIcon.textContent = '↑';
            }
        });
    }

    // Read More / Read Less toggle for Major Activities on mobile & tablet
    const btnActivitiesReadMore = document.getElementById('btn-activities-read-more');
    const activitiesMoreContent = document.getElementById('activities-more-content');

    if (btnActivitiesReadMore && activitiesMoreContent) {
        btnActivitiesReadMore.addEventListener('click', () => {
            const isExpanded = activitiesMoreContent.classList.contains('expanded');
            const btnText = btnActivitiesReadMore.querySelector('.btn-read-text');
            const btnIcon = btnActivitiesReadMore.querySelector('.btn-read-icon');

            if (isExpanded) {
                activitiesMoreContent.classList.remove('expanded');
                btnActivitiesReadMore.classList.remove('active');
                btnActivitiesReadMore.setAttribute('aria-expanded', 'false');
                if (btnText) btnText.textContent = 'View All Major Activities';
                if (btnIcon) btnIcon.textContent = '↓';
            } else {
                activitiesMoreContent.classList.add('expanded');
                btnActivitiesReadMore.classList.add('active');
                btnActivitiesReadMore.setAttribute('aria-expanded', 'true');
                if (btnText) btnText.textContent = 'Show Less Activities';
                if (btnIcon) btnIcon.textContent = '↑';
            }
        });
    }


    // ==========================================================================
    // 4. Executive Committee 3x2 Slidable Slider & Filtering
    // ==========================================================================
    const membersTrack = document.getElementById('members-track');
    const membersPrevBtn = document.getElementById('members-prev');
    const membersNextBtn = document.getElementById('members-next');
    const membersPagination = document.getElementById('members-pagination');
    const paginationDots = document.querySelectorAll('.members-pagination .pagination-dot');
    const searchInput = document.getElementById('member-search-input');
    const searchBtn = document.getElementById('member-search-btn');
    const memberCards = document.querySelectorAll('.member-card');
    let memberPageIndex = 0;

    const noResultsMsg = document.createElement('p');
    noResultsMsg.id = 'member-no-results';
    noResultsMsg.style.textAlign = 'center';
    noResultsMsg.style.gridColumn = '1 / -1';
    noResultsMsg.style.color = 'var(--color-text-muted)';
    noResultsMsg.style.display = 'none';
    noResultsMsg.textContent = 'No committee members or officers found matching your search query.';

    if (membersTrack) {
        membersTrack.appendChild(noResultsMsg);
    }

    function updateMembersSlider() {
        if (!membersTrack) return;
        const container = membersTrack.parentElement;
        if (!container) return;

        const firstCard = membersTrack.querySelector('.member-card');
        if (!firstCard) return;

        const trackStyles = window.getComputedStyle(membersTrack);
        const gap = parseFloat(trackStyles.gap) || 20;
        const colWidth = firstCard.offsetWidth + gap;
        const containerWidth = container.offsetWidth;

        const isMobile = window.innerWidth <= 600;
        const visibleCols = isMobile ? 1 : (Math.round((containerWidth + gap) / colWidth) || 1);
        const totalCards = Array.from(memberCards).filter(c => c.style.display !== 'none').length;
        const totalCols = isMobile ? totalCards : Math.ceil(totalCards / 2);
        const totalPages = Math.ceil(totalCols / visibleCols);
        const maxPageIndex = Math.max(0, totalPages - 1);

        if (memberPageIndex > maxPageIndex) memberPageIndex = maxPageIndex;
        if (memberPageIndex < 0) memberPageIndex = 0;

        const moveDistance = memberPageIndex * colWidth * visibleCols;
        membersTrack.style.transform = `translateX(-${moveDistance}px)`;

        if (membersPrevBtn) {
            membersPrevBtn.style.opacity = memberPageIndex <= 0 ? '0.3' : '1';
            membersPrevBtn.style.pointerEvents = memberPageIndex <= 0 ? 'none' : 'auto';
        }

        if (membersNextBtn) {
            membersNextBtn.style.opacity = memberPageIndex >= maxPageIndex ? '0.3' : '1';
            membersNextBtn.style.pointerEvents = memberPageIndex >= maxPageIndex ? 'none' : 'auto';
        }

        if (membersPagination) {
            membersPagination.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = `pagination-dot ${i === memberPageIndex ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => {
                    memberPageIndex = i;
                    updateMembersSlider();
                });
                membersPagination.appendChild(dot);
            }
        }
    }

    if (membersPrevBtn) {
        membersPrevBtn.addEventListener('click', () => {
            if (memberPageIndex > 0) {
                memberPageIndex--;
                updateMembersSlider();
            }
        });
    }

    if (membersNextBtn) {
        membersNextBtn.addEventListener('click', () => {
            const container = membersTrack.parentElement;
            if (container) {
                const firstCard = membersTrack.querySelector('.member-card');
                if (firstCard) {
                    const trackStyles = window.getComputedStyle(membersTrack);
                    const gap = parseFloat(trackStyles.gap) || 20;
                    const colWidth = firstCard.offsetWidth + gap;
                    const containerWidth = container.offsetWidth;
                    const visibleCols = Math.round((containerWidth + gap) / colWidth) || 1;
                    const totalCards = Array.from(memberCards).filter(c => c.style.display !== 'none').length;
                    const totalCols = Math.ceil(totalCards / 2);
                    const totalPages = Math.ceil(totalCols / visibleCols);
                    const maxPageIndex = Math.max(0, totalPages - 1);

                    if (memberPageIndex < maxPageIndex) {
                        memberPageIndex++;
                        updateMembersSlider();
                    }
                }
            }
        });
    }

    function filterMembers() {
        if (!searchInput) return;
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        if (query !== '') {
            membersTrack.style.transform = 'none';
            membersTrack.style.display = 'grid';
            membersTrack.style.gridAutoFlow = 'row';
            membersTrack.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
            if (membersPrevBtn) membersPrevBtn.style.display = 'none';
            if (membersNextBtn) membersNextBtn.style.display = 'none';
            if (membersPagination) membersPagination.style.display = 'none';
        } else {
            membersTrack.style.display = '';
            membersTrack.style.gridAutoFlow = '';
            membersTrack.style.gridTemplateColumns = '';
            if (membersPrevBtn) membersPrevBtn.style.display = '';
            if (membersNextBtn) membersNextBtn.style.display = '';
            if (membersPagination) membersPagination.style.display = '';
        }

        memberCards.forEach(card => {
            const batchText = card.querySelector('.member-batch') ? card.querySelector('.member-batch').textContent.toLowerCase() : '';
            const nameText = card.querySelector('.member-name') ? card.querySelector('.member-name').textContent.toLowerCase() : '';
            const occupationText = card.querySelector('.member-occupation') ? card.querySelector('.member-occupation').textContent.toLowerCase() : '';
            const roleElem = card.querySelector('.member-role');
            const roleText = roleElem ? roleElem.textContent.toLowerCase() : '';

            if (batchText.includes(query) || nameText.includes(query) || occupationText.includes(query) || roleText.includes(query) || query === '') {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResultsMsg.style.display = 'block';
        } else {
            noResultsMsg.style.display = 'none';
        }

        if (query === '') {
            updateMembersSlider();
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterMembers);
        if (searchBtn) {
            searchBtn.addEventListener('click', filterMembers);
        }
    }

    window.addEventListener('resize', updateMembersSlider);
    updateMembersSlider();

    // Touch Swipe gesture support for Executive Board slider
    if (membersTrack) {
        let memTouchStartX = 0;
        let memTouchEndX = 0;

        membersTrack.addEventListener('touchstart', (e) => {
            memTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        membersTrack.addEventListener('touchend', (e) => {
            memTouchEndX = e.changedTouches[0].screenX;
            const diffX = memTouchStartX - memTouchEndX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0 && membersNextBtn && membersNextBtn.style.pointerEvents !== 'none') {
                    membersNextBtn.click();
                } else if (diffX < 0 && membersPrevBtn && membersPrevBtn.style.pointerEvents !== 'none') {
                    membersPrevBtn.click();
                }
            }
        }, { passive: true });
    }

    // ==========================================================================
    // 4.5 Gallery Section Slider (Two-Row Carousel)
    // ==========================================================================
    const galleryTrack = document.getElementById('gallery-track');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');
    let gallerySlideIndex = 0;

    function updateGallerySliderPosition() {
        if (!galleryTrack) return;
        const firstItem = galleryTrack.querySelector('.gallery-item');
        if (!firstItem) return;
        
        const trackStyles = window.getComputedStyle(galleryTrack);
        const gap = parseFloat(trackStyles.gap) || 20;
        const colWidth = firstItem.offsetWidth + gap;
        
        // Translate the track horizontally
        galleryTrack.style.transform = `translateX(-${gallerySlideIndex * colWidth}px)`;
        
        // Calculate bounds
        const containerWidth = galleryTrack.parentElement.offsetWidth;
        const visibleCols = Math.round(containerWidth / colWidth) || 1;
        const totalCols = Math.ceil(galleryTrack.children.length / 2); // 2 rows of items
        
        // Disable/enable buttons
        if (gallerySlideIndex <= 0) {
            galleryPrevBtn.style.opacity = '0.3';
            galleryPrevBtn.style.pointerEvents = 'none';
        } else {
            galleryPrevBtn.style.opacity = '1';
            galleryPrevBtn.style.pointerEvents = 'auto';
        }
        
        if (gallerySlideIndex >= totalCols - visibleCols) {
            galleryNextBtn.style.opacity = '0.3';
            galleryNextBtn.style.pointerEvents = 'none';
        } else {
            galleryNextBtn.style.opacity = '1';
            galleryNextBtn.style.pointerEvents = 'auto';
        }
    }

    if (galleryPrevBtn && galleryNextBtn && galleryTrack) {
        galleryNextBtn.addEventListener('click', () => {
            const firstItem = galleryTrack.querySelector('.gallery-item');
            if (!firstItem) return;
            const trackStyles = window.getComputedStyle(galleryTrack);
            const gap = parseFloat(trackStyles.gap) || 20;
            const colWidth = firstItem.offsetWidth + gap;
            const containerWidth = galleryTrack.parentElement.offsetWidth;
            const visibleCols = Math.round(containerWidth / colWidth) || 1;
            const totalCols = Math.ceil(galleryTrack.children.length / 2);
            
            if (gallerySlideIndex < totalCols - visibleCols) {
                gallerySlideIndex++;
                updateGallerySliderPosition();
            }
        });
        
        galleryPrevBtn.addEventListener('click', () => {
            if (gallerySlideIndex > 0) {
                gallerySlideIndex--;
                updateGallerySliderPosition();
            }
        });
        
        window.addEventListener('resize', () => {
            gallerySlideIndex = 0; // Reset slider position on resize to avoid layout drift
            updateGallerySliderPosition();
        });

        // Touch Swipe gesture support for Gallery slider
        let galTouchStartX = 0;
        let galTouchEndX = 0;

        galleryTrack.addEventListener('touchstart', (e) => {
            galTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        galleryTrack.addEventListener('touchend', (e) => {
            galTouchEndX = e.changedTouches[0].screenX;
            const diffX = galTouchStartX - galTouchEndX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0 && galleryNextBtn && galleryNextBtn.style.pointerEvents !== 'none') {
                    galleryNextBtn.click();
                } else if (diffX < 0 && galleryPrevBtn && galleryPrevBtn.style.pointerEvents !== 'none') {
                    galleryPrevBtn.click();
                }
            }
        }, { passive: true });

        // Initialize slider position
        setTimeout(updateGallerySliderPosition, 100);
    }


    // ==========================================================================
    // 5. Gallery Lightbox Modal
    // ==========================================================================
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentImageIndex = 0;

    if (lightboxModal && lightboxImg && lightboxClose) {

        const updateLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentImageIndex = index;
            const item = galleryItems[index];
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-overlay').textContent;

            lightboxImg.src = img.src;
            lightboxCaption.textContent = title;
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateLightbox(index);
                lightboxModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            });
        });

        const showNextImage = () => {
            let nextIndex = currentImageIndex + 1;
            if (nextIndex >= galleryItems.length) {
                nextIndex = 0; // Wrap around
            }
            updateLightbox(nextIndex);
        };

        const showPrevImage = () => {
            let prevIndex = currentImageIndex - 1;
            if (prevIndex < 0) {
                prevIndex = galleryItems.length - 1; // Wrap around
            }
            updateLightbox(prevIndex);
        };

        // Prev and Next Button Clicks
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrevImage();
            });
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showNextImage();
            });
        }

        // Close lightbox when clicking the X button
        lightboxClose.addEventListener('click', closeLightbox);

        // Close lightbox when clicking outside the wrapper
        lightboxModal.addEventListener('click', (e) => {
            const wrapper = lightboxModal.querySelector('.lightbox-wrapper');
            if (e.target === lightboxModal && (!wrapper || !wrapper.contains(e.target))) {
                closeLightbox();
            }
        });

        // Key Navigation (ESC to close, Left/Right arrows to slide)
        document.addEventListener('keydown', (e) => {
            if (lightboxModal.style.display === 'flex') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowRight') {
                    showNextImage();
                } else if (e.key === 'ArrowLeft') {
                    showPrevImage();
                }
            }
        });
    }

    function closeLightbox() {
        lightboxModal.style.display = 'none';
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
        document.body.style.overflow = ''; // Restore background scrolling
    }


    // ==========================================================================
    // 6. Contact Form Validation & Form Submission UI Feedback
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear any previous error/success messages
            const feedbacks = contactForm.querySelectorAll('.form-feedback');
            feedbacks.forEach(f => {
                f.style.display = 'none';
                f.classList.remove('error');
            });

            const successFeedback = document.getElementById('form-success-message');
            if (successFeedback) {
                successFeedback.style.display = 'none';
            }

            // Input fields
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            let isValid = true;

            // Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
                isValid = false;
            }

            // Validate Email
            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                showError(emailInput, 'Email is required.');
                isValid = false;
            } else if (!validateEmail(emailValue)) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required.');
                isValid = false;
            }

            if (isValid) {
                // Mock form submission logic
                console.log('Form data submitted:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                });

                // Display success message
                if (successFeedback) {
                    successFeedback.textContent = `Thank you, ${nameInput.value}! Your message has been sent successfully.`;
                    successFeedback.style.display = 'block';
                    successFeedback.classList.add('success');
                }

                // Reset form
                contactForm.reset();
            }
        });
    }

    function showError(inputElement, errorMessage) {
        const group = inputElement.closest('.form-group');
        if (group) {
            const feedbackElement = group.querySelector('.form-feedback');
            if (feedbackElement) {
                feedbackElement.textContent = errorMessage;
                feedbackElement.style.display = 'block';
                feedbackElement.classList.add('error');
            }
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
