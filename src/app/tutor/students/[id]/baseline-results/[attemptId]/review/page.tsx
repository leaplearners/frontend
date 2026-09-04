"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetQuizAttemptById, useGetQuizQuestions } from "@/lib/api/queries";
import {
  usePatchAddQuizFeedback,
  usePatchMarkQuizQuestionAsCorrect,
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
  parseQuizFeedbackText,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { MathPreview } from "@/components/resourceManagemement/editor/math-preview";
import { QuestionImage } from "@/components/ui/question-image";
import { TutorOverallQuizFeedback } from "@/components/platform/quiz/overall-quiz-feedback";

interface QuestionWithResults {
  id: string;
  question: any;
  result: QuizResult;
}

interface QuizResult {
  id?: string;
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
  /** @deprecated Prefer questionFeedback / tutorFeedback */
  feedback?: string;
  questionFeedback?: string;
  tutorFeedback?: string;
  questionAttemptId?: string;
}

export default function BaselineReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.attemptId as string;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackTexts, setFeedbackTexts] = useState<Record<string, string>>(
    {},
  );
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);

  // id is the quizAttemptId
  const { data: reviewResponse, isLoading, error } = useGetQuizAttemptById(id);
  const review = reviewResponse?.data;
  const curriculumLessonId = (review as any)?.curriculumLessonId as
    | string
    | null
    | undefined;

  const { data: questionsResponse } = useGetQuizQuestions(review?.quizId || "");

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
          image: qq.question.image || qq.question.image_url,
          image_url: qq.question.image_url || qq.question.image,
          imageSettings: qq.question.imageSettings,
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

  // Seed editable tutor feedback from review results
  useMemo(() => {
    if (questionsWithResults.length > 0) {
      const initialFeedbacks: Record<string, string> = {};
      questionsWithResults.forEach((q: QuestionWithResults) => {
        if (q.result?.tutorFeedback) {
          initialFeedbacks[q.question.id] = parseQuizFeedbackText(
            q.result.tutorFeedback,
          );
        }
      });
      setFeedbackTexts(initialFeedbacks);
    }
  }, [questionsWithResults]);

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
                Failed to load baseline test review. Please try again.
              </AlertDescription>
            </Alert>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.push("/baseline-results")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questionsWithResults[currentQuestionIndex];
  const currentResult = currentQ?.result;
  const currentHasTutorFeedback = Boolean(
    (currentQ && feedbackTexts[currentQ.question.id]) ||
      parseQuizFeedbackText(
        currentResult?.tutorFeedback || currentResult?.feedback,
      ),
  );

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
          {/* Summary Header */}
          <Card
            className={cn(
              "mb-6",
              parseQuizFeedbackText(review.overallFeedback) &&
                "border-2 border-amber-500",
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Baseline Test Review</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Correct Answers
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {review.results.filter((r: QuizResult) => r.isCorrect).length}
                    /{review.results.length}
                  </p>
                </div>
              </div>
              <TutorOverallQuizFeedback
                attemptId={review.attemptId || id}
                existingFeedback={review.overallFeedback}
              />
            </CardContent>
          </Card>

          {/* Current Question */}
          {currentQ && (
            <Card
              className={cn(
                currentHasTutorFeedback && "border-2 border-amber-500",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1} of{" "}
                    {questionsWithResults.length}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {currentHasTutorFeedback && (
                      <Badge className="border-transparent bg-amber-500 text-white shadow hover:bg-amber-500 gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Feedback added
                      </Badge>
                    )}
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
                        <span className="ml-2">
                          {currentResult.pointsEarned}/
                          {currentResult.pointsPossible} points
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Question Content */}
                  <div>
                    <p className="text-base font-medium mb-2">Question:</p>
                    <MathPreview
                      content={String(currentQ.question.content ?? "")}
                      renderMarkdown={true}
                      className="text-base text-textGray whitespace-pre-wrap"
                    />
                    {(currentQ.question.image || currentQ.question.image_url) && (
                      <QuestionImage
                        src={currentQ.question.image || currentQ.question.image_url}
                        alt="Question illustration"
                        metadata={currentQ.question.imageSettings ? { image_settings: currentQ.question.imageSettings } : undefined}
                      />
                    )}
                  </div>

                                    {/* User's Answer */}
                  {currentResult && (
                    <div>
                      <p className="text-base font-medium mb-2">Your Answer:</p>
                      {(currentQ.question.type === "multiple_choice" ||
                        currentQ.question.type === "true_false") &&
                        currentQ.question.options &&
                        currentQ.question.options.length > 0 ? (
                        <div className="space-y-3">
                          {!mcTfUserAnswered && (
                            <Alert className="border-muted bg-muted/40">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                You did not answer this question.
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
                              You did not answer this question.
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
                              You did not answer this question.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Correct Answer */}
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

                  {/* System / question feedback from review response */}
                  {currentResult && currentResult.questionFeedback && (
                    <div>
                      <p className="text-base font-medium mb-2">Feedback:</p>
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <MathPreview
                            content={String(currentResult.questionFeedback)}
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
                        currentResult.questionAttemptId ||
                        currentResult.id ||
                        ""
                      }
                      isCorrect={currentResult.isCorrect}
                      attemptId={id}
                      existingFeedback={
                        currentResult.tutorFeedback ||
                        currentResult.feedback ||
                        ""
                      }
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

                  {/* Explanation */}
                  {currentQ.question.explanation && (
                    <div>
                      <p className="text-base font-medium mb-2">Explanation:</p>
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <MathPreview
                            content={currentQ.question.explanation}
                            renderMarkdown={true}
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
                      {currentQuestionIndex + 1} of {questionsWithResults.length}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          prev < questionsWithResults.length - 1 ? prev + 1 : prev
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

        {/* Sidebar */}
        <Card className="w-64 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-base">Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[80vh] overflow-y-auto p-1.5">
              {questionsWithResults.map(
                (q: QuestionWithResults, index: number) => {
                  const result = q.result;
                  const isCurrent = currentQuestionIndex === index;
                  const hasFeedback =
                    !!feedbackTexts[q.question.id] || !!result?.tutorFeedback;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      aria-current={isCurrent ? "true" : undefined}
                      aria-label={`Question ${index + 1}${
                        result?.isCorrect
                          ? ", correct"
                          : result
                            ? ", incorrect"
                            : ""
                      }${hasFeedback ? ", has tutor feedback" : ""}`}
                      className={cn(
                        "w-full min-w-0 rounded-md text-sm font-medium transition-colors overflow-hidden border-2 text-left",
                        result?.isCorrect
                          ? "bg-green-100 text-green-800 border-green-400 hover:bg-green-200"
                          : result
                            ? "bg-red-100 text-red-800 border-red-400 hover:bg-red-200"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                        isCurrent && "ring-2 ring-offset-1 ring-slate-800",
                        hasFeedback && "border-amber-500",
                      )}
                    >
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            result?.isCorrect
                              ? "bg-green-600 text-white"
                              : result
                                ? "bg-red-600 text-white"
                                : "bg-gray-400 text-white",
                          )}
                        >
                          {index + 1}
                        </div>
                        <span className="truncate flex-1">
                          Question {index + 1}
                        </span>
                        {result?.isCorrect ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        ) : result ? (
                          <XCircle className="h-4 w-4 flex-shrink-0" />
                        ) : null}
                      </div>
                      {hasFeedback && (
                        <div className="flex items-center justify-center gap-1 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wide py-1 px-2">
                          <MessageSquare className="h-3 w-3" />
                          Feedback
                        </div>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface FeedbackSectionProps {
  questionId: string;
  questionAttemptId: string;
  isCorrect: boolean;
  attemptId: string;
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
  attemptId,
  existingFeedback,
  feedbackText,
  onFeedbackChange,
  editingFeedback,
  setEditingFeedback,
}: FeedbackSectionProps) {
  const queryClient = useQueryClient();
  const [showMarkCorrectDialog, setShowMarkCorrectDialog] = useState(false);
  const [addToCorrectOptions, setAddToCorrectOptions] = useState(false);

  const parsedExistingFeedback = parseQuizFeedbackText(existingFeedback);
  const parsedFeedbackText = parseQuizFeedbackText(feedbackText);
  const currentFeedback = parsedFeedbackText || parsedExistingFeedback;

  const [localFeedback, setLocalFeedback] = useState(currentFeedback);
  const isEditing = editingFeedback === questionId;

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
      },
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
          queryClient.invalidateQueries({
            queryKey: ["quiz-attempt", attemptId],
          });
          toast.success("Question marked as correct.");
        },
        onError: (error) => {
          console.error("Error marking question as correct:", error);
          toast.error("Failed to mark question as correct. Please try again.");
        },
      },
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
          Your tutor&apos;s feedback:
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
              Add more feedback
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={localFeedback}
            onChange={(e) => setLocalFeedback(e.target.value)}
            placeholder="Write additional feedback for the student..."
            className="min-h-[100px]"
            disabled={isPending || isMarkingQuestionAsCorrect}
            aria-label="Your tutor's feedback"
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
              disabled={isPending || isMarkingQuestionAsCorrect}
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
      ) : currentFeedback ? (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <MathPreview
              content={currentFeedback}
              renderMarkdown
              className="whitespace-pre-wrap text-yellow-800"
            />
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-dashed border-muted bg-muted/30">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-sm text-muted-foreground italic">
            No tutor feedback yet. Use &quot;Add more feedback&quot; to leave a
            note for the student (separate from the system feedback above).
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
                Your tutor&apos;s feedback (optional)
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
