/**
 * Banner Persistente del Disclaimer Legal
 * 
 * Visible en todas las pantallas principales.
 * NO OCULTABLE - NO COLAPSABLE
 */

import { DISCLAIMER_BANNER } from '../constants/disclaimer'
import './DisclaimerBanner.css'

function DisclaimerBanner() {
    return (
        <div className="disclaimer-banner" role="alert">
            <span className="banner-text">{DISCLAIMER_BANNER}</span>
        </div>
    )
}

export default DisclaimerBanner
