'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
};

type CartItem = Product & { quantity: number };

const CART_KEY = 'clothing_cart';

const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    image: '/tennis_tshirt1.jpg',
    price: 25
  },
  {
    id: '2',
    name: 'Denim Jacket',
    image: '/tennis_tshirt2.jpg',
    price: 80
  },
  {
    id: '3',
    name: 'Black Hoodie',
    image: '/tennis_tshirt3.jpg',
    price: 55
  },
  {
    id: '4',
    name: 'Cargo Pants',
    image: '/tennis_tshirt4.jpg',
    price: 45
  }
];

export default function Merchandise() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);

      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Successfully added to cart');
  };

  return (
    <div className='w-full bg-white text-black mx-auto p-20'>
      <h1 className='text-2xl mb-8 text-center'>NEW ARRIVALS</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {products.map(product => (
          <Card
            key={product.id}
            className='hover:shadow-lg transition-shadow duration-200 bg-transparent'>
            <CardHeader>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className='rounded-xl object-cover w-full h-64'
              />
            </CardHeader>
            <CardBody className='flex flex-col gap-3 text-black'>
              <p className='text-lg font-semibold mt-4'>{product.name}</p>
              <span className='text-md'>${product.price}</span>
              <Button
                className='w-full hover:text-yellowski bg-blue'
                onPress={() => addToCart(product)}>
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className='mt-10 text-center'>
        🛒 Cart Items:{' '}
        <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
      </div>
      <h1 className='text-2xl mb-8 text-center mt-20'>
        OUR CLOTHING SELECTION
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {products.map(product => (
          <Card
            key={product.id}
            className='hover:shadow-lg transition-shadow duration-200 bg-transparent'>
            <CardHeader>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className='rounded-xl object-cover w-full h-64'
              />
            </CardHeader>
            <CardBody className='flex flex-col gap-3 text-black'>
              <p className='text-lg font-semibold mt-4'>{product.name}</p>
              <span className='text-md'>${product.price}</span>
              <Button
                className='w-full hover:text-yellowski bg-blue'
                onPress={() => addToCart(product)}>
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
