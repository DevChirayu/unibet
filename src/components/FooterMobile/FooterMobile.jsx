import React from 'react'
import FooterHuntTreasure from './FooterHuntTreasure'
import FooterSpecialBonus from './FooterSpecialBonus'
import { Container } from 'react-bootstrap'

const FooterMobile = () => {
    return (
        <footer className='footer-mobile-container'>
            <Container>
            <div className='footer-mobile'>
                <FooterSpecialBonus />
                <FooterHuntTreasure />
            </div>
            </Container>
        </footer>
    )
}

export default FooterMobile