import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

interface Card {
    id: number;
    image: any;
    isFlipped: boolean;
    isMatched: boolean;
}

const generateCards = (): Card[] => {
    const images = [
        require('../assets/image1.png'),
        require('../assets/image2.png'),
        require('../assets/image3.png'),
        require('../assets/image4.png'),
        require('../assets/image5.png'),
        require('../assets/image6.png'),
        require('../assets/image7.png'),
        require('../assets/image8.png'),
    ];
    return [...images, ...images].sort(() => Math.random() - 0.5).map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
    }));
};

export default function MemoryGame() {
    const [cards, setCards] = useState<Card[]>(generateCards());
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [score, setScore] = useState<number>((0));
    const [highScore, setHighScore] = useState<number>(() => {
        const savedHighScore = localStorage.getItem('highScore');
        return savedHighScore ? parseInt(savedHighScore, 10) : 0
    })
    const [time, SetTime] = useState<number>(60);
    const handleCardPress = (cardIndex: number): void => {
        const newCards = [...cards];
        if (newCards[cardIndex].isFlipped || newCards[cardIndex].isMatched) {
            return;
        }
        newCards[cardIndex].isFlipped = true;
        setCards(newCards);
        setSelectedCards((prevSelected) => [...prevSelected, cardIndex]);
    };
    useEffect(() => {
        if (selectedCards.length === 2) {
            const [firstIndex, secondIndex] = selectedCards;
            if (cards[firstIndex].image === cards[secondIndex].image) {
                const newCards = [...cards];
                newCards[firstIndex].isMatched = true;
                newCards[secondIndex].isMatched = true;
                setCards(newCards);
                setScore((prevScore) => prevScore + 10);
            } else {
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstIndex].isFlipped = false;
                    newCards[secondIndex].isFlipped = false;
                    setCards(newCards);
                },1000);
            }
            setSelectedCards([]);
        }
    },[selectedCards,cards]);

    useEffect(()=>{
        const timer = setInterval(()=>{
            SetTime((prevTime)=>{
                if(prevTime<=1){
                    clearInterval(timer);
                    if(score>highScore){
                        setHighScore(score);
                        localStorage.setItem('highScore', score.toString());
                    }
                    return 0;
                }
                return prevTime -1;
            });
        },1000);
        return () => clearInterval(timer);
    },[score,highScore]);


    return (
        <View style={styles.container}>
          <Text style={styles.title}>Jeu de Memory</Text>
          <Text style={styles.timer}>Temps restant: {time}s</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.highScore}>Meilleur score: {highScore}</Text>
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, card.isFlipped || card.isMatched ? styles.flippedCard : styles.unflippedCard]}
                onPress={() => handleCardPress(index)}
                disabled={card.isFlipped || card.isMatched}
              >
                {card.isFlipped || card.isMatched ? (
                  <Image source={card.image} style={styles.cardImage} />
                ) : (
                  <Text style={styles.cardText}>?</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        },
        timer: {
          fontSize: 18,
          marginBottom: 10,
        },
        score: {
          fontSize: 18,
          marginBottom: 10,
        },
        highScore: {
          fontSize: 18,
          marginBottom: 20,
        },
        grid: {
          width: '80%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        },
        card: {
          width: 70,
          height: 100,
          margin: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        },
        unflippedCard: {
          backgroundColor: '#888',
        },
        flippedCard: {
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
        },
        cardImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        },
        cardText: {
          fontSize: 32,
        },
      });
      