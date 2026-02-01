import React, { useEffect } from 'react';

const InstagramReel = ({ url }) => {
    useEffect(() => {
        // Load Instagram Embed Script if not already loaded
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        } else {
            const script = document.createElement('script');
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [url]);

    return (
        <div className="flex justify-center w-full my-4">
            <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                    background: '#FFF',
                    border: '0',
                    borderRadius: '12px',
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                    margin: '1px',
                    maxWidth: '540px',
                    minWidth: '326px',
                    padding: '0',
                    width: '99.375%',
                    WebkitCalc: '100% - 2px',
                    calc: '100% - 2px'
                }}
            >
                <div style={{ padding: '16px' }}>
                    <a href={url} style={{ background: '#FFFFFF', lineHeight: '0', padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }} target="_blank" rel="noreferrer">
                        View this post on Instagram
                    </a>
                </div>
            </blockquote>
        </div>
    );
};

export default InstagramReel;
