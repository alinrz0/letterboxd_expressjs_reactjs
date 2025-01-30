import "./Header.css"; // Import CSS for styling
import Icon from "../assets/icons/Icon.svg";

const Header = () => {
  return (
    <>
    <input type="checkbox" id="header-toggle" hidden />

    <header>
        <div class="logo-container">
            <label class="logo">
                <img src={Icon} alt="Icon" class="logo-icon" />
                <h1>LetterBOXD</h1>
            </label>
        </div>
        
    
        <input type="checkbox" id="nav-toggle" class="nav-toggle" />
        <label for="nav-toggle" class="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
        </label>

        <nav class="links-container">
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">About Us</a>
            <a href="#" class="nav-link">Services</a>
            <a href="#" class="nav-link">Contact Us</a>
            <a href="#" class="nav-link">Login</a>
            <label for="header-toggle" class="dark-mode-toggle">
                <i class="fas fa-sun mode-icon sun"></i>
        
                <i class="fas fa-moon mode-icon moon"></i>
            </label>
    
        </nav>
    </header>

    </>
  );
};

export default Header;
