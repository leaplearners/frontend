"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetHomeworkById, useGetQuizQuestions } from "@/lib/api/queries";
import {
  usePatchAddQuizFeedback,
  usePatchMarkQuizQuestionAsCorrect,
  usePatchMarkHomeworkAsReviewed,
  usePatchDismissHomeworkReview
} from "@/lib/api/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  cn,
  getCorrectAnswerText,
  getQuizUserAnswerDisplayText,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { MathPreview } from "@/components/resourceManagemement/editor/math-preview";
import { QuestionImage } from "@/components/ui/question-image";

interface QuestionWithResults {
  id: string;
  question: any;
  result: QuizResult;
}

interface QuizResult {
  id?: string; // Question attempt ID
  questionId: string;
  userAnswerContent?: string;
  userAnswerId?: string;
  correctAnswers: Array<{
    id: string;
    content: string | Record<string, string>;
  }>;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  feedback?: string;
  questionAttemptId?: string;
}

export default function TutorHomeworkReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackTexts, setFeedbackTexts] = useState<Record<string, string>>(
    {}
  );
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [showMarkReviewedDialog, setShowMarkReviewedDialog] = useState(false);
  const [showDismissFromListDialog, setShowDismissFromListDialog] =
    useState(false);

  const { data: reviewResponse, isLoading, error } = useGetHomeworkById(id);
  const review = reviewResponse?.data;

  // Mark as reviewed mutation
  const { mutate: markAsReviewed, isPending: isMarkingAsReviewed } =
    usePatchMarkHomeworkAsReviewed(id);

  // Dismiss from list mutation
  const { mutate: dismissFromList, isPending: isDismissingFromList } =
    usePatchDismissHomeworkReview(id);

  // Fetch questions for the quiz
  const { data: questionsResponse } = useGetQuizQuestions(review?.quizId || "");

  // Transform questions and map with results
  const questionsWithResults = useMemo(() => {
    if (!review?.results || !questionsResponse?.data) return [];

    const questions = questionsResponse.data.sort(
      (a: any, b: any) => a.orderIndex - b.orderIndex
    );

    return questions.map((qq: any) => {
      const result = review.results.find(
        (r: QuizResult) => r.questionId === qq.question.id
      );

      return {
        id: qq.id,
        question: {
          id: qq.question.id,
          title: qq.question.title,
          content: qq.question.content,
          type: qq.question.type,
          // Support both new (`image`) and legacy (`image_url`) formats
          image: (qq.question as any).image || qq.question.image_url,
          image_url: qq.question.image_url || (qq.question as any).image,
          imageSettings: (qq.question as any).imageSettings,
          explanation: qq.question.explanation,
          metadata: qq.question.metadata,
          options:
            qq.question.type === "multiple_choice" && qq.question.answers
              ? qq.question.answers
                .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                .map((answer: any) => ({
                  id: answer.id,
                  text: answer.content,
                  isCorrect: answer.isCorrect,
                }))
              : [],
          ...(qq.question.type === "true_false" && {
            options: qq.question.answers
              ? qq.question.answers
                .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                .map((answer: any) => ({
                  id: answer.id,
                  text: answer.content,
                  isCorrect: answer.isCorrect,
                }))
              : [
                {
                  id: "true",
                  text: "True",
                  isCorrect: qq.question.metadata?.correct_answer === true,
                },
                {
                  id: "false",
                  text: "False",
                  isCorrect: qq.question.metadata?.correct_answer === false,
                },
              ],
          }),
          ...(qq.question.type === "matching_pairs" && {
            pairs: (qq.question.answers?.[0]?.matchingPairs || []).map(
              (pair: any, index: number) => ({
                id: `pair-${index}`,
                left: pair.left,
                right: pair.right,
              })
            ),
          }),
        },
        result,
      };
    });
  }, [review, questionsResponse]);

  // Initialize feedback texts from results
  useMemo(() => {
    if (questionsWithResults.length > 0) {
      const initialFeedbacks: Record<string, string> = {};
      questionsWithResults.forEach((q: QuestionWithResults) => {
        if (q.result?.feedback) {
          // Parse JSON feedback if it's a JSON string
          let feedbackText = q.result.feedback;
          try {
            const parsed = JSON.parse(feedbackText);
            if (parsed && typeof parsed === "object" && parsed.feedback) {
              feedbackText = parsed.feedback;
            }
          } catch {
            // Not JSON, use as is
          }
          initialFeedbacks[q.question.id] = feedbackText;
        }
      });
      setFeedbackTexts(initialFeedbacks);
    }
  }, [questionsWithResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primaryBlue mx-auto mb-4" />
          <p>Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load homework review. Please try again.
              </AlertDescription>
            </Alert>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/tutor/homework")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homework
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questionsWithResults[currentQuestionIndex];
  const currentResult = currentQ?.result;

  const mcTfUserAnswered =
    !currentQ ||
      !currentResult ||
      (currentQ.question.type !== "multiple_choice" &&
        currentQ.question.type !== "true_false")
      ? true
      : (() => {
        const r = currentResult;
        if (r.userAnswerId != null && String(r.userAnswerId).trim() !== "")
          return true;
        const c = r.userAnswerContent;
        if (c == null) return false;
        return String(c).trim() !== "";
      })();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6">
        {/* Main Review Area */}
        <div className="flex-1">
          {/* Results Summary Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle>Homework Review - Tutor View</CardTitle>
                    {review.isBuddyReviewed && (
                      <Badge variant="default" className="ml-2">
                        Reviewed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!review.isBuddyReviewed && (
                    <Button
                      onClick={() => setShowMarkReviewedDialog(true)}
                      disabled={isMarkingAsReviewed}
                    >
                      {isMarkingAsReviewed ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        "Mark as Reviewed"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowDismissFromListDialog(true)}
                    disabled={isDismissingFromList}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Homework
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Trophy className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Score</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {review.score}/{review.totalPoints}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Percentage
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {review.percentage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Time Spent
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatTime(review.timeSpent)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Correct Answers
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {
                        review.results.filter((r: QuizResult) => r.isCorrect)
                          .length
                      }
                      /{review.results.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Question with Results */}
          {currentQ && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of{" "}
                    {questionsWithResults.length}
                  </CardTitle>
                  {currentResult && (
                    <Badge
                      variant={
                        currentResult.isCorrect ? "default" : "destructive"
                      }
                      className="flex items-center gap-2"
                    >
                      {currentResult.isCorrect ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Incorrect
                        </>
                      )}
                      {/* <span className="ml-2">
                        {currentResult.pointsEarned}/
                        {currentResult.pointsPossible} points
                      </span> */}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Question Content */}
                  <div>
                    <p className="text-base font-medium mb-2">Question:</p>
                    <MathPreview
                      content={String(currentQ.question.content ?? "")}
                      className="text-base text-textGray whitespace-pre-wrap"
                      renderMarkdown={true}
                    />
                    {(currentQ.question.image || currentQ.question.image_url) && (
                      <QuestionImage
                        src={
                          currentQ.question.image ||
                          currentQ.question.image_url ||
                          ""
                        }
                        alt="Question illustration"
                        metadata={
                          currentQ.question.imageSettings
                            ? { image_settings: currentQ.question.imageSettings }
                            : undefined
                        }
                      />
                    )}
                  </div>

                  {/* User's Answer */}
                  {currentResult && (
                    <div>
                      <p className="text-base font-medium mb-2">
                        Student Answer:
                      </p>
                      {(currentQ.question.type === "multiple_choice" ||
                        currentQ.question.type === "true_false") &&
                        currentQ.question.options &&
                        currentQ.question.options.length > 0 ? (
                        <div className="space-y-3">
                          {!mcTfUserAnswered && (
                            <Alert className="border-muted bg-muted/40">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Student did not answer this question.
                              </AlertDescription>
                            </Alert>
                          )}
                          {currentQ.question.options.map((option: any) => {
                            const selectedId =
                              currentResult.userAnswerId ||
                              currentResult.userAnswerContent ||
                              "";
                            const isSelected =
                              selectedId !== "" &&
                              (selectedId === option.id ||
                                String(option.text ?? "").trim().toLowerCase() ===
                                String(selectedId).trim().toLowerCase());
                            const isCorrectOption =
                              (currentResult.correctAnswers?.some(
                                (ans: any) => ans.id === option.id,
                              ) ?? false) || option.isCorrect === true;

                            return (
                              <div
                                key={option.id}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg border-2",
                                  isSelected && isCorrectOption
                                    ? "bg-green-50 border-green-300"
                                    : isSelected
                                      ? "bg-red-50 border-red-300"
                                      : "border-gray-200",
                                )}
                              >
                                <div className="flex-1 min-w-0">
                                  <MathPreview
                                    content={String(option.text ?? "")}
                                    className="text-base text-textGray whitespace-pre-wrap"
                                    renderMarkdown={true}
                                  />
                                </div>
                                {isSelected && isCorrectOption ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : isSelected ? (
                                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : currentQ.question.type === "matching_pairs" ? (
                        currentResult.userAnswerContent ? (
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            {(() => {
                              try {
                                const userMatches = JSON.parse(
                                  currentResult.userAnswerContent as string,
                                ) as Record<string, string>;
                                const ca0 = currentResult.correctAnswers[0];
                                const correctMatches =
                                  ca0 && typeof ca0.content === "object"
                                    ? (ca0.content as Record<string, string>)
                                    : {};

                                return (
                                  <div className="space-y-2">
                                    {Object.entries(userMatches).map(
                                      ([leftText, rightText]) => {
                                        const correctRightText =
                                          correctMatches[leftText];
                                        const isMatchCorrect =
                                          correctRightText === rightText;

                                        return (
                                          <div
                                            key={leftText}
                                            className={cn(
                                              "p-3 rounded-lg border-2",
                                              isMatchCorrect
                                                ? "bg-green-50 border-green-300"
                                                : "bg-red-50 border-red-300",
                                            )}
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <div className="flex-1 min-w-0 flex items-center gap-1 flex-wrap">
                                                <MathPreview
                                                  content={String(leftText)}
                                                  renderMarkdown
                                                  className="font-medium"
                                                />
                                                <span>→</span>
                                                <MathPreview
                                                  content={String(rightText)}
                                                  renderMarkdown
                                                />
                                              </div>
                                              {isMatchCorrect ? (
                                                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                              ) : (
                                                <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                                              )}
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                );
                              } catch {
                                return (
                                  <MathPreview
                                    content={String(currentResult.userAnswerContent ?? "")}
                                    renderMarkdown={true}
                                    className="text-base text-textGray whitespace-pre-wrap"
                                  />
                                );
                              }
                            })()}
                          </div>
                        ) : (
                          <Alert className="border-muted bg-muted/40">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Student did not answer this question.
                            </AlertDescription>
                          </Alert>
                        )
                      ) : (
                        <div
                          className={cn(
                            "p-4 rounded-lg border-2",
                            currentResult.userAnswerContent != null &&
                              String(currentResult.userAnswerContent).trim() !==
                              ""
                              ? currentResult.isCorrect
                                ? "bg-green-50 border-green-300"
                                : "bg-red-50 border-red-300"
                              : "bg-muted/30 border-muted",
                          )}
                        >
                          {currentResult.userAnswerContent != null &&
                            String(currentResult.userAnswerContent).trim() !==
                            "" ? (
                            <MathPreview
                              content={String(
                                getQuizUserAnswerDisplayText(
                                  currentQ.question,
                                  currentResult,
                                ) ||
                                  currentResult.userAnswerContent ||
                                  "",
                              )}
                              className="text-base text-textGray whitespace-pre-wrap"
                              renderMarkdown={true}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Student did not answer this question.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentResult &&
                    (!currentResult.isCorrect ||
                      currentQ.question.type === "free_text" ||
                      currentQ.question.type === "short_answer" ||
                      currentQ.question.type === "long_answer" ||
                      currentQ.question.type === "coding") && (
                      <div>
                        <p className="text-base font-medium mb-2 text-green-700">
                          Correct Answer:
                        </p>
                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                          {currentQ.question.type === "matching_pairs" &&
                            currentResult.correctAnswers[0] &&
                            typeof currentResult.correctAnswers[0].content ===
                            "object" ? (
                            <div className="space-y-2">
                              {Object.entries(
                                currentResult.correctAnswers[0].content as Record<
                                  string,
                                  string
                                >,
                              ).map(([left, right]) => (
                                <div
                                  key={left}
                                  className="p-2 bg-white rounded border border-green-200 flex items-center gap-1 flex-wrap"
                                >
                                  <MathPreview
                                    content={String(left)}
                                    renderMarkdown
                                    className="font-medium"
                                  />
                                  <span>→</span>
                                  <MathPreview
                                    content={String(right)}
                                    renderMarkdown
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            currentQ.question.type === "free_text" ||
                            currentQ.question.type === "short_answer" ||
                            currentQ.question.type === "long_answer" ||
                            currentQ.question.type === "coding"
                          ) &&
                            Array.isArray(currentResult.correctAnswers) &&
                            currentResult.correctAnswers.length > 0 ? (
                            <div className="space-y-2">
                              {currentResult.correctAnswers.map(
                                (ans: any, index: number) => (
                                  <MathPreview
                                    key={ans.id ?? index}
                                    content={String(
                                      typeof ans.content === "object" &&
                                        ans.content !== null
                                        ? ""
                                        : (ans.content ?? ""),
                                    )}
                                    renderMarkdown={true}
                                    className="text-base text-green-900 whitespace-pre-wrap"
                                  />
                                ),
                              )}
                            </div>
                          ) : (
                            <MathPreview
                              content={getCorrectAnswerText(
                                currentQ.question,
                                currentResult as any,
                              )}
                              renderMarkdown={true}
                              className="text-base text-green-900 whitespace-pre-wrap"
                            />
                          )}
                        </div>
                      </div>
                    )}

                  {/* Question Metadata Feedback */}
                  {currentResult &&
                    currentQ.question.metadata &&
                    (currentResult.isCorrect
                      ? currentQ.question.metadata.correctFeedback
                      : currentQ.question.metadata.incorrectFeedback) && (
                      <div>
                        <p className="text-base font-medium mb-2">Feedback:</p>
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription>
                            <MathPreview
                              content={String(
                                currentResult.isCorrect
                                  ? currentQ.question.metadata.correctFeedback
                                  : currentQ.question.metadata.incorrectFeedback
                              )}
                              renderMarkdown
                              className="text-blue-800 whitespace-pre-wrap"
                            />
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                  {/* Tutor Additional Feedback Section */}
                  {currentResult && (
                    <FeedbackSection
                      questionId={currentQ.question.id}
                      questionAttemptId={
                        currentResult.id ||
                        currentResult.questionAttemptId ||
                        ""
                      }
                      isCorrect={currentResult.isCorrect}
                      homeworkId={id}
                      existingFeedback={currentResult.feedback || ""}
                      feedbackText={feedbackTexts[currentQ.question.id] || ""}
                      onFeedbackChange={(text) => {
                        setFeedbackTexts((prev) => ({
                          ...prev,
                          [currentQ.question.id]: text,
                        }));
                      }}
                      editingFeedback={editingFeedback}
                      setEditingFeedback={setEditingFeedback}
                    />
                  )}

                  {/* Explanation if available */}
                  {currentQ.question.explanation && (
                    <div>
                      <p className="text-base font-medium mb-2">Explanation:</p>
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <MathPreview
                            content={String(currentQ.question.explanation)}
                            renderMarkdown
                            className="text-blue-800 whitespace-pre-wrap"
                          />
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          prev > 0 ? prev - 1 : prev
                        )
                      }
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentQuestionIndex + 1} of{" "}
                      {questionsWithResults.length}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          prev < questionsWithResults.length - 1
                            ? prev + 1
                            : prev
                        )
                      }
                      disabled={
                        currentQuestionIndex >= questionsWithResults.length - 1
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Navigation Sidebar */}
        <Card className="w-64 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-base">Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
              {questionsWithResults.map(
                (q: QuestionWithResults, index: number) => {
                  const result = q.result;
                  const isCurrent = currentQuestionIndex === index;
                  const hasFeedback =
                    !!feedbackTexts[q.question.id] || !!result?.feedback;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={cn(
                        "w-full px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                        isCurrent
                          ? "bg-primaryBlue text-white hover:bg-primaryBlue/90"
                          : result?.isCorrect
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                            : result
                              ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                          isCurrent
                            ? "bg-white text-primaryBlue"
                            : result?.isCorrect
                              ? "bg-green-600 text-white"
                              : result
                                ? "bg-red-600 text-white"
                                : "bg-gray-400 text-white"
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="truncate flex-1 text-left">
                        Question {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {result?.isCorrect ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        ) : result ? (
                          <XCircle className="h-4 w-4 flex-shrink-0" />
                        ) : null}
                        {hasFeedback && (
                          <MessageSquare className="h-3 w-3 flex-shrink-0 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove from homework list confirmation */}
      <AlertDialog
        open={showDismissFromListDialog}
        onOpenChange={setShowDismissFromListDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from homework list?</AlertDialogTitle>
            <AlertDialogDescription>
              Cancel returns you to the homework page without removing this item.
              Remove from List removes this quiz from your homework list, then
              returns you to the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDismissingFromList}
              onClick={() => {
                setShowDismissFromListDialog(false);
                router.push("/tutor/homework");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                dismissFromList(undefined, {
                  onSuccess: () => {
                    setShowDismissFromListDialog(false);
                    toast.success("Removed from homework list");
                    router.push("/tutor/homework");
                  },
                  onError: () => {
                    toast.error(
                      "Failed to remove from homework list. Please try again.",
                    );
                  },
                });
              }}
              disabled={isDismissingFromList}
            >
              {isDismissingFromList ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove from List"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark as Reviewed Confirmation Dialog */}
      <AlertDialog
        open={showMarkReviewedDialog}
        onOpenChange={setShowMarkReviewedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Reviewed?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this homework as reviewed? This
              action will update the homework status and the student will be
              notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMarkingAsReviewed}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                markAsReviewed(undefined, {
                  onSuccess: () => {
                    // Invalidate the current homework query to refresh the status
                    queryClient.invalidateQueries({
                      queryKey: ["homework", id],
                    });
                    toast.success("Homework marked as reviewed!");
                    // Route back to homework list after a short delay
                    setTimeout(() => {
                      router.push("/tutor/homework");
                    }, 500);
                  },
                  onError: (error) => {
                    console.error("Error marking as reviewed:", error);
                    toast.error(
                      "Failed to mark as reviewed. Please try again."
                    );
                  },
                });
              }}
              disabled={isMarkingAsReviewed}
            >
              {isMarkingAsReviewed ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                "Mark as Reviewed"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FeedbackSectionProps {
  questionId: string;
  questionAttemptId: string;
  isCorrect: boolean;
  homeworkId: string;
  existingFeedback: string;
  feedbackText: string;
  onFeedbackChange: (text: string) => void;
  editingFeedback: string | null;
  setEditingFeedback: (id: string | null) => void;
}

function FeedbackSection({
  questionId,
  questionAttemptId,
  isCorrect,
  homeworkId,
  existingFeedback,
  feedbackText,
  onFeedbackChange,
  editingFeedback,
  setEditingFeedback,
}: FeedbackSectionProps) {
  const queryClient = useQueryClient();
  const [showMarkCorrectDialog, setShowMarkCorrectDialog] = useState(false);
  const [addToCorrectOptions, setAddToCorrectOptions] = useState(false);

  // Parse feedback if it's a JSON string
  const parseFeedback = (feedback: string): string => {
    if (!feedback) return "";
    try {
      const parsed = JSON.parse(feedback);
      if (parsed && typeof parsed === "object" && parsed.feedback) {
        return parsed.feedback;
      }
    } catch {
      // Not JSON, use as is
    }
    return feedback;
  };

  const parsedExistingFeedback = parseFeedback(existingFeedback);
  const parsedFeedbackText = parseFeedback(feedbackText);
  const currentFeedback = parsedFeedbackText || parsedExistingFeedback;

  const [localFeedback, setLocalFeedback] = useState(currentFeedback);
  const isEditing = editingFeedback === questionId;

  // Reset localFeedback when question changes (not editing)
  useEffect(() => {
    if (!isEditing) {
      setLocalFeedback(currentFeedback);
    }
  }, [questionId, currentFeedback, isEditing]);

  const { mutate: addFeedback, isPending } =
    usePatchAddQuizFeedback(questionAttemptId);

  const {
    mutate: markQuestionAsCorrect,
    isPending: isMarkingQuestionAsCorrect,
  } = usePatchMarkQuizQuestionAsCorrect(questionAttemptId);

  const handleSaveFeedback = () => {
    if (!localFeedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    addFeedback(
      { feedback: localFeedback },
      {
        onSuccess: () => {
          onFeedbackChange(localFeedback);
          setEditingFeedback(null);
          toast.success("Feedback saved successfully!");
        },
        onError: (error) => {
          console.error("Error saving feedback:", error);
          toast.error("Failed to save feedback. Please try again.");
        },
      }
    );
  };

  const handleMarkAsCorrect = () => {
    if (!questionAttemptId) {
      toast.error("Missing question attempt ID. Cannot mark as correct.");
      return;
    }

    const trimmed = localFeedback.trim();
    markQuestionAsCorrect(
      {
        ...(trimmed ? { feedback: trimmed } : {}),
        addToCorrectOptions,
      },
      {
        onSuccess: () => {
          if (trimmed) onFeedbackChange(trimmed);
          setEditingFeedback(null);
          setShowMarkCorrectDialog(false);
          setAddToCorrectOptions(false);
          queryClient.invalidateQueries({ queryKey: ["homework", homeworkId] });
          toast.success("Question marked as correct.");
        },
        onError: (error) => {
          console.error("Error marking question as correct:", error);
          toast.error("Failed to mark question as correct. Please try again.");
        },
      }
    );
  };

  const handleCancel = () => {
    setLocalFeedback(currentFeedback);
    setEditingFeedback(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <Label className="text-base font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Feedback:
        </Label>
        <div className="flex items-center gap-2">
          {!isCorrect && questionAttemptId && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-50"
              onClick={() => {
                setAddToCorrectOptions(false);
                setShowMarkCorrectDialog(true);
              }}
              disabled={isMarkingQuestionAsCorrect}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Mark as Correct
            </Button>
          )}
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingFeedback(questionId)}
            >
              {currentFeedback ? "Edit Feedback" : "Add Feedback"}
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={localFeedback}
            onChange={(e) => setLocalFeedback(e.target.value)}
            placeholder="Enter feedback for the student..."
            className="min-h-[100px]"
            disabled={isPending || isMarkingQuestionAsCorrect}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending || isMarkingQuestionAsCorrect}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveFeedback}
              disabled={
                isPending ||
                isMarkingQuestionAsCorrect ||
                !localFeedback.trim()
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Feedback"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Alert
          className={cn(
            "border-yellow-200",
            existingFeedback || feedbackText ? "bg-yellow-50" : "bg-gray-50"
          )}
        >
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <MathPreview
              content={currentFeedback || "No feedback provided yet"}
              renderMarkdown
              className={cn(
                "whitespace-pre-wrap",
                currentFeedback ? "text-yellow-800" : "text-gray-500 italic"
              )}
            />
          </AlertDescription>
        </Alert>
      )}

      <AlertDialog
        open={showMarkCorrectDialog}
        onOpenChange={(open) => {
          if (!isMarkingQuestionAsCorrect) {
            setShowMarkCorrectDialog(open);
            if (!open) setAddToCorrectOptions(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark this question as correct?</AlertDialogTitle>
            <AlertDialogDescription>
              This overrides the automatic grade and awards full points for this
              question. You can optionally include feedback for the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`mark-correct-feedback-${questionId}`}>
                Feedback (optional)
              </Label>
              <Textarea
                id={`mark-correct-feedback-${questionId}`}
                value={localFeedback}
                onChange={(e) => setLocalFeedback(e.target.value)}
                placeholder="Optional note for the student..."
                className="min-h-[90px]"
                disabled={isMarkingQuestionAsCorrect}
              />
            </div>
            <div className="flex items-start gap-3 rounded-md border p-3">
              <Checkbox
                id={`add-to-correct-options-${questionId}`}
                checked={addToCorrectOptions}
                onCheckedChange={(checked) =>
                  setAddToCorrectOptions(checked === true)
                }
                disabled={isMarkingQuestionAsCorrect}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor={`add-to-correct-options-${questionId}`}
                  className="cursor-pointer font-medium"
                >
                  Also add this answer to correct options
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include the student&apos;s answer in the question&apos;s
                  correct answers for future attempts.
                </p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isMarkingQuestionAsCorrect}
              onClick={() => setAddToCorrectOptions(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleMarkAsCorrect();
              }}
              disabled={isMarkingQuestionAsCorrect}
              className="bg-green-600 hover:bg-green-700"
            >
              {isMarkingQuestionAsCorrect ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Marking...
                </>
              ) : (
                "Mark as Correct"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
