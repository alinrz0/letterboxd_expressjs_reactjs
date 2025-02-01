import React, { useEffect } from "react";
import "./footer.css";

const Footer = () => {
  // Function to check if the page has a scrollbar and adjust footer positioning
  const adjustFooter = () => {
    const footer = document.querySelector("footer");
    const bodyHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // If the body height is smaller than or equal to the window height (no scroll)
    if (bodyHeight <= windowHeight + 100) {
      footer.style.position = "fixed";  // Stick footer to the bottom
      footer.style.bottom = "0";
    } else {
      footer.style.position = "relative";  // Footer moves with the content
      footer.style.bottom = "";
    }
  };

  useEffect(() => {
    // Trigger adjustFooter on page load and window resize
    window.addEventListener("load", adjustFooter);
    window.addEventListener("resize", adjustFooter);

    // Set up MutationObserver to watch for changes in the document
    const observer = new MutationObserver(adjustFooter);

    // Start observing changes to the body of the document (add/remove nodes, style changes)
    observer.observe(document.body, {
      childList: true,        // Observe added/removed child elements
      subtree: true,          // Observe all descendants of the body
      attributes: true,       // Observe attribute changes (like scroll height)
    });

    // Trigger adjustFooter after initial load
    adjustFooter();

    // Cleanup event listeners and MutationObserver when the component unmounts
    return () => {
      window.removeEventListener("load", adjustFooter);
      window.removeEventListener("resize", adjustFooter);
      observer.disconnect();  // Disconnect MutationObserver
    };
  }, []);  // Empty dependency array ensures this effect runs once on mount

  return (
    <footer>
      <p>@KNTU 4031</p>
    </footer>
  );
};

export default Footer;
