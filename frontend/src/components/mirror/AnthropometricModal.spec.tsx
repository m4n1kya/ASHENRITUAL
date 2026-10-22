/**
 * @fileoverview Unit Tests for AnthropometricModal
 * @module AnthropometricModal.spec.tsx
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnthropometricModal } from "./AnthropometricModal";
import { computeAnthropometrics } from "@/lib/vto/anthropometrics";

// Mock framer-motion with Proxy
jest.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_, tag: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ children, ...props }: any) =>
          React.createElement(tag, props, children),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("AnthropometricModal", () => {
  const mockMetrics = computeAnthropometrics(178, 72, "cm", "kg");
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open with height, weight and live anthropometric stats", () => {
    render(
      <AnthropometricModal
        isOpen={true}
        currentMetrics={mockMetrics}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    // Modal title & subtitle
    expect(screen.getByText("Calibrate Body Proportions")).toBeInTheDocument();
    expect(
      screen.getByText("Precision anatomical metrics for 3D drape & virtual sizing.")
    ).toBeInTheDocument();

    // Height & Weight controls
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();

    // Calculated proportions
    expect(screen.getByText("Calculated Frame Proportions")).toBeInTheDocument();
    expect(screen.getByText("Shoulder Span")).toBeInTheDocument();
    expect(screen.getByText("Chest Girth")).toBeInTheDocument();
    expect(screen.getByText("Torso Drop")).toBeInTheDocument();
    expect(screen.getByText("BMI Index")).toBeInTheDocument();

    // Action buttons
    expect(screen.getByText("Reset Defaults")).toBeInTheDocument();
    expect(screen.getByText("Apply Fit Calibration")).toBeInTheDocument();
  });

  it("calls onSave and onClose when clicking Apply Fit Calibration", () => {
    render(
      <AnthropometricModal
        isOpen={true}
        currentMetrics={mockMetrics}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const applyButton = screen.getByText("Apply Fit Calibration");
    fireEvent.click(applyButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("allows switching units between CM and FT / IN", () => {
    render(
      <AnthropometricModal
        isOpen={true}
        currentMetrics={mockMetrics}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const ftButton = screen.getByText("FT / IN");
    fireEvent.click(ftButton);

    expect(screen.getByText("Feet")).toBeInTheDocument();
    expect(screen.getByText("Inches")).toBeInTheDocument();
  });

  it("allows resetting to standard defaults", () => {
    render(
      <AnthropometricModal
        isOpen={true}
        currentMetrics={mockMetrics}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const resetButton = screen.getByText("Reset Defaults");
    fireEvent.click(resetButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        heightCm: 178,
        weightKg: 72,
      })
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
