"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertCircle, Upload, ImageIcon, Camera } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageAnalysisResults from "@/components/image-analysis-results"

export default function ImageAnalysisPage() {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [originalImage, setOriginalImage] = useState(null)
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState("")
  const [activeTab, setActiveTab] = useState("upload")

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setImage(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleOriginalImageChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setOriginalImage(selectedFile)
      setOriginalPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value)
  }

  const loadImageFromUrl = () => {
    if (!imageUrl) {
      setError("Please enter an image URL")
      return
    }

    setError(null)
    setPreviewUrl(imageUrl)
    setImage(null) // Clear any file upload
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsWebcamActive(true)
      }
    } catch (err) {
      setError("Failed to access webcam: " + err.message)
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsWebcamActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob/file
      canvas.toBlob((blob) => {
        const capturedImage = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" })
        setImage(capturedImage)
        setPreviewUrl(URL.createObjectURL(blob))
      }, "image/jpeg")

      // Stop the webcam
      stopWebcam()
    }
  }

  const analyzeImage = async () => {
    if (!previewUrl) {
      setError("Please upload or capture an image first")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults(null) // Clear previous results when starting a new analysis

    try {
      // In a real implementation, you would call your API here
      const formData = new FormData()
      if (image) {
        formData.append("image", image)
      } else if (previewUrl) {
        // If using URL, we need to pass it differently
        formData.append("imageUrl", previewUrl)
      }

      if (originalImage) {
        formData.append("originalImage", originalImage)
      }

      // For demo purposes, use simulateAnalysis instead of actual API call
      simulateAnalysis()
      
      // Uncomment below for actual API call in production
      /*
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()
      setResults(data)
      setIsAnalyzing(false)
      */
    } catch (err) {
      setError(err.message || "An error occurred during analysis")
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImage(null)
    setOriginalImage(null)
    setImageUrl("")
    setPreviewUrl("")
    setOriginalPreviewUrl("")
    setResults(null)
    setError(null)
    if (isWebcamActive) {
      stopWebcam()
    }
  }

  // For demo purposes, simulate analysis with mock data
  const simulateAnalysis = () => {
    setTimeout(() => {
      const mockResults = {
        aiProbability: Math.random() * 100,
        realProbability: 100 - Math.random() * 100,
        confidence: 85 + Math.random() * 15,
        heatmap: "/placeholder.svg?height=400&width=600",
        detectedArtifacts: [
          { name: "Facial inconsistencies", score: 20 + Math.random() * 80 },
          { name: "Unnatural lighting", score: 20 + Math.random() * 80 },
          { name: "Background anomalies", score: 20 + Math.random() * 80 },
          { name: "Texture irregularities", score: 20 + Math.random() * 80 },
        ],
        modelDetection: {
          detectedModel: Math.random() > 0.5 ? "Stable Diffusion" : "DALL-E",
          probability: 75 + Math.random() * 25,
        },
      }

      setResults(mockResults)
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    // Reset error when changing tabs
    setError(null)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Image Analysis</h1>
          <p className="text-muted-foreground">
            Detect AI-generated images and deepfakes using advanced analysis techniques
          </p>
        </div>

        {/* Main content area with fixed height to prevent layout shifts */}
        <div className="min-h-[700px]">
          <Tabs 
            defaultValue="upload" 
            className="mb-8"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-4 rounded-xl">
              <TabsTrigger className="rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300" value="upload">Upload Image</TabsTrigger>
              <TabsTrigger className="rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300" value="url">Image URL</TabsTrigger>
              <TabsTrigger className="rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300" value="webcam">Webcam</TabsTrigger>
              <TabsTrigger className="rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300" value="comparison">Compare Images</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card className="border-blue-700 m-4">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Upload an image to analyze for AI generation or manipulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center min-h-[300px]">
                    {previewUrl && !isWebcamActive ? (
                      <div className="mb-4 max-w-full">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-[200px] rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                        <div className="mb-4">
                          <h3 className="font-medium">Upload an image</h3>
                          <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                        </div>
                      </>
                    )}

                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isAnalyzing}
                    />
                    <Button asChild variant="secondary">
                      <label htmlFor="image-upload" className="flex items-center h-14 w-35 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-pointer p-4">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </label>
                    </Button>
                    {image && (
                      <div className="mt-4 text-sm">
                        Selected: <span className="font-medium">{image.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button className="m-4 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300"
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing || (!previewUrl && !originalPreviewUrl && !results)}
                  >
                    Clear
                  </Button>
                  <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300" onClick={analyzeImage} disabled={isAnalyzing || !previewUrl}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card className="border-blue-700 m-4">
                <CardHeader>
                  <CardTitle>Compare Images</CardTitle>
                  <CardDescription>Upload an original image and a suspected deepfake for comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Label>Original Image</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center min-h-[200px]">
                        {originalPreviewUrl ? (
                          <div className="mb-4 max-w-full">
                            <img
                              src={originalPreviewUrl || "/placeholder.svg"}
                              alt="Original"
                              className="max-h-[160px] rounded-lg object-contain"
                            />
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <div className="mb-2">
                              <p className="text-sm text-muted-foreground">Upload original image</p>
                            </div>
                          </>
                        )}

                        <input
                          type="file"
                          id="original-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleOriginalImageChange}
                          disabled={isAnalyzing}
                        />
                        <Button asChild variant="secondary" size="sm">
                          <label htmlFor="original-image-upload" className="flex items-center h-14 w-32 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-pointer p-4">
                            <Upload className="mr-2 h-4 w-4" />
                            Browse
                          </label>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Suspected Deepfake</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center min-h-[200px]">
                        {previewUrl && !isWebcamActive ? (
                          <div className="mb-4 max-w-full">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Suspected"
                              className="max-h-[160px] rounded-lg object-contain"
                            />
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <div className="mb-2">
                              <p className="text-sm text-muted-foreground">Upload suspected deepfake</p>
                            </div>
                          </>
                        )}

                        <input
                          type="file"
                          id="suspected-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isAnalyzing}
                        />
                        <Button asChild variant="secondary" size="sm">
                          <label htmlFor="suspected-image-upload" className="flex items-center h-14 w-32 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-pointer p-4">
                            <Upload className="mr-2 h-4 w-4" />
                            Browse
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button className="m-4 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300"
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing || (!previewUrl && !originalPreviewUrl && !results)}
                  >
                    Clear
                  </Button>
                  <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300" onClick={analyzeImage} disabled={isAnalyzing || !previewUrl || !originalPreviewUrl}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Compare & Analyze"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="url">
              <Card className="border-blue-700 m-4">
                <CardHeader>
                  <CardTitle>Image URL</CardTitle>
                  <CardDescription>Enter the URL of an image to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image-url"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={handleUrlChange}
                          disabled={isAnalyzing}
                        />
                        <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300" onClick={loadImageFromUrl} disabled={isAnalyzing || !imageUrl}>
                          Load
                        </Button>
                      </div>
                    </div>

                    <div className="min-h-[200px] flex justify-center items-center">
                      {previewUrl && imageUrl === previewUrl ? (
                        <div className="border rounded-lg p-4 max-w-full">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-[200px] rounded-lg object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <p>Image preview will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button className="m-4 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300"
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing || (!previewUrl && !originalPreviewUrl && !results)}
                  >
                    Clear
                  </Button>
                  <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300" onClick={analyzeImage} disabled={isAnalyzing || !previewUrl || imageUrl !== previewUrl}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="webcam">
              <Card className="border-blue-700 m-4">
                <CardHeader>
                  <CardTitle>Webcam Capture</CardTitle>
                  <CardDescription>Capture an image from your webcam to analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center min-h-[300px]">
                    {isWebcamActive ? (
                      <div className="relative w-full max-w-[600px]">
                        <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <Button onClick={captureImage} variant="secondary" className="flex items-center rounded-xl bg-white hover:bg-cyan-500 hover:text-black">
                            <Camera className="mr-2 h-4 w-4" />
                            Capture
                          </Button>
                        </div>
                      </div>
                    ) : previewUrl ? (
                      <div className="mb-4 max-w-full">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Captured"
                          className="max-h-[200px] rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                        <div className="mb-4">
                          <h3 className="font-medium">Use your webcam</h3>
                          <p className="text-sm text-muted-foreground">Capture an image to analyze</p>
                        </div>
                        <Button onClick={startWebcam} variant="secondary" className="flex items-center h-16 w-40 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-pointer p-4">
                          <Camera className="mr-2 h-4 w-4" />
                          Start Webcam
                        </Button>
                      </>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button className="m-4 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300"
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing || (!previewUrl && !isWebcamActive && !originalPreviewUrl && !results)}
                  >
                    Clear
                  </Button>
                  <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300" onClick={analyzeImage} disabled={isAnalyzing || !previewUrl || isWebcamActive}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAnalyzing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analyzing Image</CardTitle>
                <CardDescription>Running multiple detection algorithms to analyze the image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Facial Analysis</span>
                      <span>Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Artifact Detection</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Lighting & Shadow Analysis</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Generating Heatmap</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results && !isAnalyzing && <ImageAnalysisResults results={results} imageUrl={previewUrl} />}
        </div>
      </div>
    </div>
  )
}