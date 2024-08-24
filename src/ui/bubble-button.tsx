import React from 'react';
import { Text, Pressable, View, PressableProps } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { GestureResponderEvent } from 'react-native';
import { Sequares } from './icons';
import { white } from './colors';

// Tailwind Variants Configuration
const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-full px-4',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6 text-white',
  },
  variants: {
    variant: {
      default: {
        container: 'bg-black dark:bg-white',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
      },
      secondary: {
        container: 'bg-primary-600',
        label: 'text-secondary-600',
        indicator: 'text-white',
      },
      blue: {
        container: 'bg-blue-500',
        label: 'text-secondary-600',
        indicator: 'text-white',
      },
      outline: {
        container: 'border border-neutral-400',
        label: 'text-black dark:text-neutral-100',
        indicator: 'text-black dark:text-neutral-100',
      },
      destructive: {
        container: 'bg-red-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { container: 'h-9 w-9' },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
    active: {
      true: {
        container: 'bg-green-600 dark:bg-green-400',
        label: 'text-white',
        indicator: 'text-white',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
    active: false,
  },
});

// Define TypeScript types
type ButtonVariants = VariantProps<typeof button>;

interface BubbleButtonProps extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  active?: boolean;
  icon?: React.ReactNode; // Add icon prop
}

const BubbleButton = React.forwardRef<View, BubbleButtonProps>(
  (
    {
      label,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      active = false,
      onPress,
      icon, 
      ...rest
    },
    ref
  ) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = (event: GestureResponderEvent) => {
      scale.value = withSpring(1);
      if (onPress) {
        onPress(event);
      }
    };

    const styles = button({ variant, disabled, size, active });

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          className={styles.container({ className })}
          testID={testID}
          {...rest}
        >

          {loading ? (
            <ActivityIndicator
              size="small"
              className={styles.indicator()}
              testID={testID ? `${testID}-activity-indicator` : undefined}
            />
          ) : (
            <View>
              <Sequares color={white} />
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

export default BubbleButton;
