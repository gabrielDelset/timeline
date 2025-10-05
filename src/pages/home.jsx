import React, { useRef, useEffect, useState } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import styled, { createGlobalStyle } from 'styled-components';

import PopupScreen from './popup';
import PopupCreateScreen from './popupcreateevent';
import { getTimeline } from '../tools/API/api';
import { useAuth } from '../tools/AuthContext';

// ---------- STYLES ----------
const GlobalTimelineStyle = createGlobalStyle`
  .vis-timeline {
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  /* Texte centré par défaut */
  .vis-item .vis-item-content {
    font-weight: bold;
  }

  .vis-item {
    background-color: #18e218;
    color: #000;
    border-radius: 4px;
    padding: 4px 6px;
    font-size: 14px;
    
  }
  .vis-item:hover { background-color: #45a049; cursor: pointer; }
  .vis-time-axis .vis-text { font-weight: bold; color: #000; }
`;

const PageWrapper = styled.div`background:#fff; padding:20px;`;
const TimelineWrapper = styled.div`
  margin-top:10%;
  display:flex; flex-direction:column; align-items:center;
  width:100%; height:100vh;
`;
const TimelineContainer = styled.div`width:100%; height:100px;`;

// ---------- COMPONENT ----------
const Home = () => {
  const container = useRef(null);
  const timelineRef = useRef(null);
  const { email } = useAuth();
  const table = useRef('table1');

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupCreateOpen, setIsPopupCreateOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    (async () => {
      try {
        const res = await getTimeline(email, table.current);
        setItems(res?.data ?? []);
      } catch (e) {
        console.error('Erreur timeline:', e);
      }
    })();
  }, [email]);

  // Ajuste l'alignement selon la moitié de l’élément
  const adjustItemAlignment = () => {
    const host = container.current;
    if (!host) return;

    // viewport central
    const panel =
      host.querySelector('.vis-panel.vis-center') ||
      host.querySelector('.vis-panel');
    const viewport = panel ?? host;
    const vpRect = viewport.getBoundingClientRect();

    const itemEls = host.querySelectorAll('.vis-item');
    itemEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      const midX = (r.left + r.right) / 2;

      // reset
      el.classList.remove('align-left', 'align-right');

      if (r.left < vpRect.left && midX < vpRect.left) {
        // plus de la moitié sortie à gauche
        el.classList.add('align-left');
      } else if (r.right > vpRect.right && midX > vpRect.right) {
        // plus de la moitié sortie à droite
        el.classList.add('align-right');
      }
    });
  };

  // Create timeline + hooks
  useEffect(() => {
    if (!container.current) return;

    const options = {
      selectable: true,
      editable: false,
      align : 'center',
      showCurrentTime: false,
      zoomMin: 604800000,
      zoomMax: 3155760000000,
    };

    const timeline = new Timeline(container.current, items, options);
    timelineRef.current = timeline;

    const onSelect = (ev) => {
      const id = ev.items[0];
      if (!id) return;
      const found = items.find((it) => it.id === id);
      if (found) {
        setSelectedItem(found);
        setIsPopupOpen(true);
      }
    };
    const onDoubleClick = (ev) => {
      if (!ev.item) setIsPopupCreateOpen(true);
    };
    const onAnyChange = () => requestAnimationFrame(adjustItemAlignment);

    timeline.on('select', onSelect);
    timeline.on('doubleClick', onDoubleClick);
    timeline.on('rangechange', onAnyChange);
    timeline.on('rangechanged', onAnyChange);
    timeline.on('changed', onAnyChange);

    requestAnimationFrame(adjustItemAlignment);
    const onResize = () => requestAnimationFrame(adjustItemAlignment);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      timeline.destroy();
      timelineRef.current = null;
    };
  }, [items]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsPopupCreateOpen(false);
    setSelectedItem(null);
  };

  const refreshTimeline = async () => {
    try {
      const updated = await getTimeline(email, table.current);
      setItems(updated?.data ?? []);
      requestAnimationFrame(adjustItemAlignment);
    } catch (e) {
      console.error('Erreur maj timeline:', e);
    }
  };

  return (
    <PageWrapper>
      <GlobalTimelineStyle />

      <TimelineWrapper>
        <TimelineContainer ref={container} />
      </TimelineWrapper>

      {isPopupOpen && selectedItem && (
        <PopupScreen
          onClose={handleClosePopup}
          item={selectedItem}
          onRefresh={refreshTimeline}
        />
      )}

      {isPopupCreateOpen && (
        <PopupCreateScreen
          onClose={handleClosePopup}
          item={selectedItem}
          table={table.current}
          onRefresh={refreshTimeline}
        />
      )}
    </PageWrapper>
  );
};

export default Home;
