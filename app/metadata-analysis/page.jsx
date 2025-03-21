"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, Upload, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MetadataAnalysisPage() {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const analyzeMetadata = async () => {
    if (!file) {
      setError("Please upload a file to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // In a real implementation, you would call your API here
      // For demo purposes, we'll simulate the analysis
      simulateAnalysis()
    } catch (err) {
      setError(err.message || "An error occurred during analysis")
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setResults(null)
    setError(null)
  }

  // For demo purposes, simulate analysis with mock data
  const simulateAnalysis = () => {
    setTimeout(() => {
      const mockResults = {
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        lastModified: new Date(file.lastModified).toLocaleString(),
        metadata: {
          general: [
            { name: "File Format", value: getFileFormat(file.type), status: "normal" },
            {
              name: "Creation Date",
              value: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
              status: "normal",
            },
            { name: "Last Modified", value: new Date(file.lastModified).toLocaleString(), status: "normal" },
            { name: "File Size", value: formatFileSize(file.size), status: "normal" },
          ],
          image: file.type.startsWith("image/")
            ? [
                { name: "Dimensions", value: "3840 x 2160", status: "normal" },
                { name: "Color Space", value: "sRGB", status: "normal" },
                { name: "Bit Depth", value: "24", status: "normal" },
                {
                  name: "Camera Make",
                  value: Math.random() > 0.5 ? "Canon" : "None",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
                {
                  name: "Camera Model",
                  value: Math.random() > 0.5 ? "EOS R5" : "None",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
                {
                  name: "Exposure",
                  value: Math.random() > 0.5 ? "1/125 sec" : "None",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
                {
                  name: "Aperture",
                  value: Math.random() > 0.5 ? "f/2.8" : "None",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
                {
                  name: "ISO",
                  value: Math.random() > 0.5 ? "400" : "None",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
                {
                  name: "GPS Coordinates",
                  value: Math.random() > 0.5 ? "None" : "40.7128° N, 74.0060° W",
                  status: Math.random() > 0.5 ? "normal" : "suspicious",
                },
              ]
            : [],
          document:
            file.type.includes("pdf") || file.type.includes("word")
              ? [
                  { name: "Author", value: Math.random() > 0.5 ? "John Doe" : "None", status: "normal" },
                  {
                    name: "Created",
                    value: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
                    status: "normal",
                  },
                  {
                    name: "Modified",
                    value: new Date(Date.now() - Math.random() * 5000000000).toLocaleString(),
                    status: "normal",
                  },
                  {
                    name: "Application",
                    value: Math.random() > 0.5 ? "Microsoft Word" : "Adobe Acrobat",
                    status: "normal",
                  },
                  { name: "PDF Version", value: file.type.includes("pdf") ? "1.7" : "N/A", status: "normal" },
                ]
              : [],
        },
        analysis: {
          inconsistencies: [
            Math.random() > 0.5
              ? { description: "Missing EXIF data typically found in camera photos", severity: "medium" }
              : null,
            Math.random() > 0.5
              ? { description: "Creation date is more recent than modification date", severity: "high" }
              : null,
            Math.random() > 0.5 ? { description: "Metadata shows editing software traces", severity: "low" } : null,
          ].filter(Boolean),
          manipulationScore: Math.floor(Math.random() * 100),
          verdict: Math.random() > 0.7 ? "suspicious" : "normal",
        },
      }

      setResults(mockResults)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getFileFormat = (mimeType) => {
    const formats = {
      "image/jpeg": "JPEG Image",
      "image/png": "PNG Image",
      "image/gif": "GIF Image",
      "image/webp": "WebP Image",
      "application/pdf": "PDF Document",
      "application/msword": "Word Document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word Document (DOCX)",
      "text/plain": "Text File",
    }

    return formats[mimeType] || mimeType
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
    else return (bytes / 1073741824).toFixed(2) + " GB"
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Metadata Analysis</h1>
          <p className="text-muted-foreground">
            Examine file metadata to detect inconsistencies and signs of manipulation
          </p>
        </div>

        <Card className="h-[530px] border-blue-700 p-4">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Upload an image, document, or other file to analyze its metadata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <div className="mb-4">
                <h3 className="font-medium">Upload a file</h3>
                <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
              </div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />
              <Button asChild variant="secondary">
                <label htmlFor="file-upload" className="h-14 w-32 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-pointer p-4 gap-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </label>
              </Button>
              {file && (
                <div className="mt-4 text-sm">
                  Selected: <span className="font-medium">{file.name}</span> ({formatFileSize(file.size)})
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="m-4 rounded-xl hover:bg-cyan-500 hover:text-black transition-colors duration-300" variant="outline" onClick={resetAnalysis} disabled={isAnalyzing || (!file && !results)}>
              Clear
            </Button>
            <Button className="rounded-xl hover:bg-cyan-950 hover:text-white transition-colors duration-300 mr-4" onClick={analyzeMetadata} disabled={isAnalyzing || !file}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Metadata"
              )}
            </Button>
          </CardFooter>
        </Card>

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
              <CardTitle>Analyzing Metadata</CardTitle>
              <CardDescription>Extracting and analyzing file metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Extracting metadata from {file?.name}</p>
                    <p className="text-sm text-muted-foreground">This may take a moment...</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {results && !isAnalyzing && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>Metadata analysis for {results.filename}</CardDescription>
                  </div>
                  <Badge variant={results.analysis.verdict === "suspicious" ? "destructive" : "default"}>
                    {results.analysis.verdict === "suspicious" ? "Suspicious" : "Normal"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">File Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium">File Name</p>
                        <p className="text-sm text-muted-foreground">{results.filename}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium">File Type</p>
                        <p className="text-sm text-muted-foreground">{getFileFormat(results.fileType)}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium">File Size</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(results.fileSize)}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm font-medium">Last Modified</p>
                        <p className="text-sm text-muted-foreground">{results.lastModified}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Manipulation Score</h3>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Likelihood of manipulation</span>
                        <span className="text-sm font-medium">{results.analysis.manipulationScore}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${results.analysis.manipulationScore > 70 ? "bg-destructive" : results.analysis.manipulationScore > 30 ? "bg-warning" : "bg-primary"}`}
                          style={{ width: `${results.analysis.manipulationScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {results.analysis.manipulationScore > 70
                          ? "High likelihood of manipulation detected"
                          : results.analysis.manipulationScore > 30
                            ? "Some signs of manipulation detected"
                            : "Low likelihood of manipulation"}
                      </p>
                    </div>
                  </div>

                  {results.analysis.inconsistencies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Detected Inconsistencies</h3>
                      <div className="space-y-2">
                        {results.analysis.inconsistencies.map((inconsistency, index) => (
                          <div key={index} className="flex items-start space-x-2 bg-muted rounded-lg p-4">
                            <Badge variant={getSeverityColor(inconsistency.severity)}>{inconsistency.severity}</Badge>
                            <p className="text-sm">{inconsistency.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Metadata</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious Fields</TabsTrigger>
                <TabsTrigger value="normal">Normal Fields</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Metadata</CardTitle>
                    <CardDescription>All extracted metadata fields from the file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetadataTable
                      metadata={[
                        ...results.metadata.general,
                        ...(results.metadata.image || []),
                        ...(results.metadata.document || []),
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suspicious">
                <Card>
                  <CardHeader>
                    <CardTitle>Suspicious Metadata</CardTitle>
                    <CardDescription>Metadata fields that show signs of manipulation or inconsistency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetadataTable
                      metadata={[
                        ...results.metadata.general,
                        ...(results.metadata.image || []),
                        ...(results.metadata.document || []),
                      ].filter((item) => item.status === "suspicious")}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="normal">
                <Card>
                  <CardHeader>
                    <CardTitle>Normal Metadata</CardTitle>
                    <CardDescription>Metadata fields that appear normal and consistent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetadataTable
                      metadata={[
                        ...results.metadata.general,
                        ...(results.metadata.image || []),
                        ...(results.metadata.document || []),
                      ].filter((item) => item.status === "normal")}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

function MetadataTable({ metadata }) {
  if (metadata.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No metadata fields found in this category</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Field</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metadata.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.value}</TableCell>
            <TableCell>
              <Badge variant={item.status === "suspicious" ? "destructive" : "secondary"}>
                {item.status === "suspicious" ? "Suspicious" : "Normal"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}