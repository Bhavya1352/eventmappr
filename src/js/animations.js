gsap.registerPlugin(ScrollTrigger);


gsap.set([
  ".event-details-container", ".back-btn", ".event-header", ".event-info-card",
  ".gallery-grid", ".map-container", ".action-btn", ".info-item",
  "#photoModal", ".modal-content"
], { opacity: 0 });

gsap.set([
  ".event-details-container", ".event-header", ".event-info-card", ".action-btn"
], { y: 40 });
gsap.set(".back-btn", { x: -30 });
gsap.set([".gallery-grid", ".map-container", ".modal-content"], { scale: 0.95 });
gsap.set("#photoModal", { display: "none" });

function initializeAnimations() {

  gsap.timeline({ defaults: { ease: "power2.out" } })
    .to(".event-details-container", { opacity: 1, y: 0, duration: 1 })
    .to(".back-btn", { opacity: 1, x: 0, duration: 0.6 }, "-=0.6")
    .to(".event-header", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
    .to(".event-info-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
    .to(".gallery-grid", { opacity: 1, scale: 1, duration: 0.6 }, "-=0.3")
    .to(".map-container", { opacity: 1, scale: 1, duration: 0.6 }, "-=0.5")
    .to(".action-btn", { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, "-=0.3");


  gsap.utils.toArray(".info-item").forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

 
  gsap.to(".loading-spinner", {
    rotation: 360,
    duration: 1,
    ease: "none",
    repeat: -1
  });


  document.querySelectorAll(".gallery-item, .event-info-card, .action-btn").forEach(el => {
    el.addEventListener("mouseenter", () => {
      gsap.to(el, {
        scale: 1.05,
        duration: 0.3,
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      });
    });
  });


  const modal = document.getElementById("photoModal");
  const modalContent = document.querySelector(".modal-content");

  const originalOpen = window.openPhotoModal;
  window.openPhotoModal = index => {
    gsap.set(modalContent, { scale: 0.9, opacity: 0 });
    gsap.to(modal, { display: "flex", opacity: 1, duration: 0.3 });
    gsap.to(modalContent, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    originalOpen(index);
  };

  const originalClose = window.closePhotoModal;
  window.closePhotoModal = () => {
    gsap.to(modalContent, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(modal, {
          opacity: 0,
          duration: 0.2,
          display: "none",
          onComplete: originalClose
        });
      }
    });
  };

  document.querySelectorAll(".modal-nav").forEach(btn => {
    btn.addEventListener("mouseenter", () =>
      gsap.to(btn, { scale: 1.1, backgroundColor: "rgba(255,255,255,1)", duration: 0.3 })
    );
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { scale: 1, backgroundColor: "rgba(255,255,255,0.9)", duration: 0.3 })
    );
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loading");
  const checkLoader = () => {
    if (loader && getComputedStyle(loader).display !== "none") {
      const interval = setInterval(() => {
        if (getComputedStyle(loader).display === "none") {
          clearInterval(interval);
          setTimeout(initializeAnimations, 100);
        }
      }, 100);
    } else {
      setTimeout(initializeAnimations, 100);
    }
  };
  checkLoader();
});
