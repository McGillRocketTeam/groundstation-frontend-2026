import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import exampleStack from "@/lib/yamcs/client/stacks/example.json";
import { RunnableYCSStack, Step } from "@/lib/yamcs/client/stacks/schema";
import type { QualifiedName } from "@/lib/yamcs/client/types";
import { parameterSubscriptionAtom } from "@/lib/yamcs/client/websocket/client";
import { Result, useAtomValue } from "@effect-atom/atom-react";
import { Schema } from "effect";
import Markdown from "react-markdown";

export function StackPage() {
  const stack = Schema.decodeUnknownSync(RunnableYCSStack)(exampleStack);
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-[auto_1fr] gap-x-2 gap-y-6 p-4">
      <div className="col-span-full flex flex-row items-center justify-between">
        <h1 className="text-primary text-2xl">AutoTest.ycs</h1>
        <Button>Run from Start</Button>
      </div>
      {stack.steps.map((step) => (
        <div key={step.key} className="col-span-full grid grid-cols-subgrid">
          <div className="py-2">
            <StepIndicator step={step} />
          </div>
          <div className="bg-muted/25 flex flex-col gap-2 border p-2">
            <div>
              <StackStep step={step} />
            </div>
            {step.comment && <Badge>{step.comment}</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepIndicator({
  step,
}: {
  step: (typeof RunnableYCSStack.Type.steps)[number];
}) {
  switch (step.state) {
    case "pending":
      return <div className="">[ ]:</div>;
    case "running":
      return <div className="bg-warning-background text-warning">[.]:</div>;
    case "success":
      return <div className="bg-success-background text-success">[✓]:</div>;
    case "error":
      return <div className="bg-error-background text-error">[✗]:</div>;
  }
}

function StackStep({ step }: { step: typeof Step.Type }) {
  switch (step.type) {
    case "text":
      return (
        <div className="prose">
          <Markdown>{step.text}</Markdown>
        </div>
      );
    case "check":
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <div className="col-span-full">Parameters:</div>
          {step.parameters.map((p) => (
            <div key={p.key} className="col-span-full grid grid-cols-subgrid">
              <span>{p.parameter}</span>
              <CheckView parameter={p.parameter} />
            </div>
          ))}
        </div>
      );
    case "command":
      return <div>Command: {step.name}</div>;
    case "verify":
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <div className="col-span-full">Verify:</div>
          {step.condition.map((c) => (
            <div key={c.key} className="col-span-full grid grid-cols-subgrid">
              <span>
                {c.parameter} {c.operator.toString()} {c.value.toString()}
              </span>
              <ConditionView
                parameter={c.parameter}
                target={c.value.toString()}
              />
            </div>
          ))}
        </div>
      );
  }
}

function ConditionView({
  parameter,
  target,
}: {
  parameter: QualifiedName;
  target: string;
}) {
  const result = useAtomValue(parameterSubscriptionAtom(parameter));
  return Result.match(result, {
    onInitial() {
      return <div>--</div>;
    },
    onFailure() {
      return <Badge variant="error">Error Fetching Param</Badge>;
    },
    onSuccess({ value }) {
      if (value.engValue.value.toString() === target)
        return (
          <Badge className="w-full justify-start text-left" variant="success">
            {value.engValue.value.toString()}
          </Badge>
        );
      else {
        return (
          <Badge className="w-full justify-start text-left" variant="error">
            {value.engValue.value.toString()}
          </Badge>
        );
      }
    },
  });
}

function CheckView({ parameter }: { parameter: QualifiedName }) {
  const result = useAtomValue(parameterSubscriptionAtom(parameter));
  return Result.match(result, {
    onInitial() {
      return <div>--</div>;
    },
    onFailure() {
      return <Badge variant="error">Error Fetching Param</Badge>;
    },
    onSuccess({ value }) {
      return <div>{value.engValue.value.toString()}</div>;
    },
  });
}
