import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';
const FontAwesome = _FontAwesome as React.ElementType;

const { width } = Dimensions.get('window');
const GRID_SIZE = 20;
const CELL_SIZE = width / GRID_SIZE;

const SnakeGame: React.FC = () => {
  const navigation = useNavigation();
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchHighScore = async () => {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    };
    fetchHighScore();
    placeFood();
  }, []);

  useEffect(() => {
    if (isGameRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(moveSnake, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameRunning, direction]);

  const placeFood = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood({ x, y });
  };

  const moveSnake = () => {
    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      for (let segment of prevSnake) {
        if (segment.x === newHead.x && segment.y === newHead.y) {
          handleGameOver();
          return prevSnake;
        }
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prevScore => prevScore + 1);
        placeFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const handleGameOver = async () => {
    setIsGameRunning(false);
  
    if (score > highScore) {
      await AsyncStorage.setItem('highScore', score.toString());
      setHighScore(score);
    }
  
    Alert.alert('Perdu!', `Votre score: ${score}`, [
      {
        text: 'OK',
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    placeFood();
  };

  const changeDirection = (newDirection: { x: number; y: number }) => {
    setDirection(prevDirection => {
      if (
        (newDirection.x === 0 && prevDirection.y === newDirection.y) ||
        (newDirection.y === 0 && prevDirection.x === newDirection.x)
      ) {
        return prevDirection;
      }
      return newDirection;
    });
  };

  const handleStartGame = () => {
    setIsGameRunning(true);
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.highScore}>High Score: {highScore}</Text>
      </View>
      <View style={styles.gameBoard}>
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.snake,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
              },
            ]}
          />
        ))}
        <Image
          source={require('../assets/food.png')}
          style={[
            styles.food,
            {
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            },
          ]}
        />
      </View>
      <View style={styles.controlsContainer}>
        {!isGameRunning && (
          <TouchableOpacity onPress={handleStartGame} style={styles.startButton}>
            <Text style={styles.controlText}>Start Game</Text>
          </TouchableOpacity>
        )}
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={() => changeDirection({ x: 0, y: -1 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={() => changeDirection({ x: -1, y: 0 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeDirection({ x: 1, y: 0 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Right</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity onPress={() => changeDirection({ x: 0, y: 1 })} style={styles.controlButton}>
            <Text style={styles.controlText}>Down</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    width: '100%',
    marginTop:10,
    padding: 20,
  },
  score: {
    paddingLeft:30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameBoard: {
    width: width,
    height: width,
    backgroundColor: '#e0e0e0',
  },
  snake: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  controlsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  controlButton: {
    padding: 20,
    backgroundColor: '#4CAF50',
    margin: 5,
    width:150,
  },
  startButton: {
    padding: 20,
    backgroundColor: '#FF5722',
    marginBottom: 20,
  },
  controlText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
  },
  backButton: {
    position: 'absolute',
    top:50,
    left: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    zIndex: 1000,
  },
});

export default SnakeGame;
