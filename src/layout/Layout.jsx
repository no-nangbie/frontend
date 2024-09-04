import React from 'react';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();

  // /login 경로에서는 헤더와 푸터를 숨기고, 다른 경로에서는 보여줌
//   const hideLayout = location.pathname === '/login';
  const hideLayout = location.pathname === '/login';

  return (
    <div>
      {!hideLayout && (
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
      )}
      <main>
        {children}
      </main>
      {!hideLayout && (
        <footer>
          <p>© 2024 My Website</p>
        </footer>
      )}
    </div>
  );
}

export default Layout;
