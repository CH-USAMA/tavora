"use client";

// Injects keyframe animations needed by HeroSection into the document
export function HeroAnimations() {
    return (
        <style>{`
            @keyframes drift {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(40px, -30px) scale(1.1); }
            }
            @keyframes sweep {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
        `}</style>
    );
}
