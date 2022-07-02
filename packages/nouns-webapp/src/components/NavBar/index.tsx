import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useEtherBalance } from '@usedapp/core';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CHAIN_ID } from '../../config';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import useLidoBalance from '../../hooks/useLidoBalance';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import NavLocaleSwitcher from '../NavLocaleSwitcher';
import { retrieveMatic } from './RetrieveMatic';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink(String(process.env.REACT_APP_NOUNDERSDAO_ADDRESS));
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const [maticBalance, setMaticBalance] = useState("0")

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun/') ||
    history.location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);

  useEffect(() => {
    retrieveMatic()
    .then((res) => {
      setMaticBalance(String(res))
    })
  }, [])

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={logo} className={classes.navBarLogo} alt="Nouns DAO logo" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                tNouns
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    // treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                    treasuryBalance={maticBalance}
                    treasuryStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </Nav.Item>
          </div>
          <Navbar.Toggle
            className={classes.navBarToggle}
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
              <NavBarButton
                buttonText={<Trans>DAO</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.notion)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Docs</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.discourse)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Discourse</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faComments} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/playground"
              className={classes.nounsNavLink}
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Playground</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
            <NavLocaleSwitcher buttonStyle={nonWalletButtonStyle} />
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
