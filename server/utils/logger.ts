import chalk from 'chalk';

export const logger = {
  info: (context: string, message: string) => {
    console.log(chalk.blue(`[${context}] ${message}`));
  },
  success: (context: string, message: string) => {
    console.log(chalk.green(`[${context}] ${message}`));
  },
  warn: (context: string, message: string) => {
    console.log(chalk.yellow(`[${context}] ${message}`));
  },
  error: (context: string, message: string, error?: any) => {
    console.error(chalk.red(`[${context}] ${message}`));
    if (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error details:'), {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      } else {
        console.error(chalk.red('Error details:'), error);
      }
    }
  },
  debug: (context: string, message: string, data?: any) => {
    console.log(chalk.gray(`[${context}] ${message}`));
    if (data) {
      console.log(chalk.gray('Debug data:'), data);
    }
  },
};
