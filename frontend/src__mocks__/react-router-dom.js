// Mock manual para react-router-dom
module.exports = {
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ children }) => children,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null })
  };
  