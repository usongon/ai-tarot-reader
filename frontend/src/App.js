import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const GamePhase = {
    SELECTION: 'SELECTION',
    TOPIC_SELECTION: 'TOPIC_SELECTION',
    DRAWING: 'DRAWING',
    RESULT: 'RESULT',
};

const DIVINATION_TOPICS = ["事业", "爱情", "财运", "健康", "综合运势"];

function App() {
    const [spreads, setSpreads] = useState([]);
    const [selectedSpread, setSelectedSpread] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [deck, setDeck] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [phase, setPhase] = useState(GamePhase.SELECTION);
    const [interpretation, setInterpretation] = useState('');
    const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
    const [showInterpretationModal, setShowInterpretationModal] = useState(false);

    useEffect(() => {
        fetch('/api/spreads')
            .then(response => response.json())
            .then(data => setSpreads(data));
    }, []);

    const handleSelectSpread = (spreadId) => {
        const spread = spreads.find(s => s.id === spreadId);
        setSelectedSpread(spread);
        setPhase(GamePhase.TOPIC_SELECTION);
    };

    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic);
    };

    const dealCards = () => {
        if (!selectedSpread || !selectedTopic) return;
        fetch('/api/deck')
            .then(response => response.json())
            .then(data => {
                const positionedDeck = data.map(card => ({
                    ...card,
                    top: `${Math.random() * 60 + 15}vh`,
                    left: `${Math.random() * 75 + 12.5}vw`,
                    transform: `rotate(${Math.random() * 50 - 25}deg)`
                }));
                setDeck(positionedDeck);
                setFlippedIndices([]);
                setInterpretation('');
                setPhase(GamePhase.DRAWING);
            });
    };

    const handleFlip = (index) => {
        if (phase !== GamePhase.DRAWING || flippedIndices.includes(index)) return;

        if (flippedIndices.length < selectedSpread.numberOfCards) {
            const newFlipped = [...flippedIndices, index];
            setFlippedIndices(newFlipped);
            if (newFlipped.length === selectedSpread.numberOfCards) {
                setPhase(GamePhase.RESULT);
            }
        }
    };

    const handleInterpret = () => {
        if (flippedIndices.length !== selectedSpread.numberOfCards) return;
        setShowInterpretationModal(true);
        setIsLoadingInterpretation(true);
        setInterpretation('');

        const drawnCards = flippedIndices.map(index => deck[index]);

        const requestBody = {
            direction: selectedTopic,
            spreadName: selectedSpread.nameChinese,
            cards: drawnCards
        };

        fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            setInterpretation(text);
        })
        .catch(error => {
            console.error('Error fetching interpretation:', error);
            setInterpretation('抱歉，解读服务当前不可用，请稍后再试。');
        })
        .finally(() => {
            setIsLoadingInterpretation(false);
        });
    };

    const resetGame = () => {
        setSelectedSpread(null);
        setSelectedTopic('');
        setDeck([]);
        setFlippedIndices([]);
        setInterpretation('');
        setIsLoadingInterpretation(false);
        setShowInterpretationModal(false);
        setPhase(GamePhase.SELECTION);
    };

    const renderPhase = () => {
        switch (phase) {
            case GamePhase.SELECTION:
                return (
                    <div className="selection-screen">
                        <h1>塔罗牌占卜</h1>
                        <p>请选择一个牌阵开始</p>
                        <Form.Control as="select" onChange={e => handleSelectSpread(e.target.value)} defaultValue="">
                            <option value="" disabled>选择牌阵...</option>
                            {spreads.map(s => <option key={s.id} value={s.id}>{s.nameChinese} - {s.descriptionChinese}</option>)}
                        </Form.Control>
                    </div>
                );
            case GamePhase.TOPIC_SELECTION:
                return (
                    <div className="selection-screen">
                        <h1>选择占卜主题</h1>
                        <p>请选择你想要占卜的方向</p>
                        <div className="topic-buttons">
                            {DIVINATION_TOPICS.map(topic => (
                                <Button
                                    key={topic}
                                    variant={selectedTopic === topic ? "primary" : "outline-primary"}
                                    onClick={() => handleSelectTopic(topic)}
                                    className="m-2 topic-btn"
                                >
                                    {topic}
                                </Button>
                            ))}
                        </div>
                        <Button variant="success" onClick={dealCards} disabled={!selectedTopic} className="mt-4">
                            选好了，开始抽牌
                        </Button>
                         <Button variant="secondary" onClick={resetGame} className="mt-3">返回</Button>
                    </div>
                );
            case GamePhase.DRAWING:
            case GamePhase.RESULT:
                return (
                    <div className="drawing-screen">
                        <div className="game-info">
                            <h2>{selectedSpread.nameChinese} ({selectedTopic})</h2>
                            <p>请选择 {selectedSpread.numberOfCards} 张牌 - 已选择 {flippedIndices.length} / {selectedSpread.numberOfCards}</p>
                            <div>
                                <Button variant="info" onClick={dealCards} className="mr-2">重新洗牌</Button>
                                <Button variant="secondary" onClick={resetGame}>返回主页</Button>
                            </div>
                        </div>
                        <div className="card-area">
                            {deck.map((card, index) => (
                                <div
                                    key={index}
                                    className={`flip-card ${flippedIndices.includes(index) ? 'flipped' : ''}`}
                                    style={{
                                        top: card.top,
                                        left: card.left,
                                        transform: card.transform,
                                        zIndex: flippedIndices.includes(index) ? 100 + flippedIndices.indexOf(index) : index
                                    }}
                                    onClick={() => handleFlip(index)}
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front custom-card-back"></div>
                                        <div className="flip-card-back custom-card-face">
                                            <div
                                                className="card-image-container"
                                                title={`${card.nameChinese} ${card.reversed ? '(逆位)' : '(正位)'}`}
                                            >
                                                <img src={card.imagePath} alt={card.nameChinese} className="card-image" style={{ transform: card.reversed ? 'rotate(180deg)' : 'none' }} />
                                            </div>
                                            <div className="card-content">
                                                <p className="card-meaning">{card.reversed ? card.reversedMeaningChinese : card.uprightMeaningChinese}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {phase === GamePhase.RESULT && (
                            <div className="result-area">
                                <Button variant="warning" onClick={handleInterpret} disabled={isLoadingInterpretation}>
                                    {isLoadingInterpretation ? '解读中...' : 'AI塔罗大师解读'}
                                </Button>
                            </div>
                        )}
                        <Modal show={showInterpretationModal} onHide={() => setShowInterpretationModal(false)} centered size="lg" dialogClassName="interpretation-modal">
                            <Modal.Header closeButton>
                                <Modal.Title>AI塔罗大师的解读</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {isLoadingInterpretation && (
                                    <div className="loading-indicator">
                                        <Spinner animation="border" />
                                        <p>AI大师正在思考，请稍候...</p>
                                    </div>
                                )}
                                {interpretation && (
                                    <div className="interpretation-container">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowInterpretationModal(false)}>
                                    关闭
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            {renderPhase()}
        </div>
    );
}

export default App;
