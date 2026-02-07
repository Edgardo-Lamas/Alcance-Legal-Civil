import Navigation from '../Navigation/Navigation'
import DisclaimerBanner from '../DisclaimerBanner'
import './PageLayout.css'

function PageLayout({ children }) {
    return (
        <div className="page-layout">
            <DisclaimerBanner />
            <Navigation />
            <main className="page-layout__content">
                <div className="page-layout__inner">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default PageLayout
