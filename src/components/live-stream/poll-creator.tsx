'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Plus, Trash, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Poll } from '@/types/stream';

interface PollCreatorProps {
  createPoll: (question: string, options: string[], duration: number) => void;
  endPoll: (pollId: string) => void;
  activePolls: Poll[];
}

export function PollCreator({ createPoll, endPoll, activePolls }: PollCreatorProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [duration, setDuration] = useState(60);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    const filteredOptions = options.filter(option => option.trim() !== '');
    if (question.trim() && filteredOptions.length >= 2) {
      createPoll(question.trim(), filteredOptions, duration);
      resetForm();
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setDuration(60);
    setIsCreating(false);
  };

  const calculateTimeLeft = (poll: Poll) => {
    if (!poll.startTime || !poll.duration) return 0;

    const endTime = poll.startTime + poll.duration * 1000;
    const now = Date.now();
    const timeLeft = Math.max(0, endTime - now);
    return Math.floor(timeLeft / 1000);
  };

  const calculateProgress = (poll: Poll) => {
    if (!poll.startTime || !poll.duration) return 0;

    const totalDuration = poll.duration * 1000;
    const elapsed = Date.now() - poll.startTime;
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    return 100 - progress;
  };

  const getTotalVotes = (poll: Poll) => {
    return poll.options.reduce((sum, option) => sum + option.votes, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Polls
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? 'Cancel' : 'Create Poll'}
          </Button>
        </div>
        <CardDescription>Create interactive polls for your viewers</CardDescription>
      </CardHeader>
      <CardContent>
        {isCreating ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="Ask your viewers a question..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Options (min 2, max 6)</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={e => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {options.length < 6 && (
                <Button variant="outline" size="sm" className="mt-2" onClick={handleAddOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min={10}
                max={300}
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 60)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePoll}
                disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
              >
                Create Poll
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {activePolls.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {activePolls.map(poll => (
                    <div key={poll.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{poll.question}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={poll.isActive ? 'default' : 'secondary'}>
                              {poll.isActive ? 'Active' : 'Ended'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {getTotalVotes(poll)} votes
                            </span>
                          </div>
                        </div>

                        {poll.isActive && (
                          <Button variant="ghost" size="icon" onClick={() => endPoll(poll.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {poll.isActive && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Time remaining</span>
                            <span>{calculateTimeLeft(poll)}s</span>
                          </div>
                          <Progress value={calculateProgress(poll)} />
                        </div>
                      )}

                      <div className="space-y-2 pt-1">
                        {poll.options.map((option, index) => {
                          const totalVotes = getTotalVotes(poll);
                          const percentage =
                            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{option.text}</span>
                                <span>{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <p className="text-xs text-muted-foreground">{option.votes} votes</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No active polls</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsCreating(true)}
                >
                  Create your first poll
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
