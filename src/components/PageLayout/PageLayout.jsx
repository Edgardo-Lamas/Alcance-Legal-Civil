import Navigation from '../Navigation/Navigation'
import DisclaimerBanner from '../DisclaimerBanner'
import './PageLayout.css'

function PageLayout({ children }) {
    return (
        <div className="page-wrapper">
            <DisclaimerBanner />
            <div className="page-layout">
                <Navigation />
                <main className="page-layout__content">
                    <div className="page-layout__inner">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PageLayout
